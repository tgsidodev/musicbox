// This class will represent the gif display area. It keeps track of which gif
// is being shown and can select a new random gif to be shown.
//
// See HW4 writeup for more hints and details.
class GifDisplay {
  constructor() {
    this.containerElement = document.querySelector('.gif-display-area');

    this.currentGifUrl = null;
    this.currentQuery = null;
    this.gifUrlArray = [];
    this.gifsToPreload = [];
    this.numGifsLoaded = 0;

    this.isForegroundGifDisplayed = false;
    this.isBackgroundGifDisplayed = false;
    this.foregroundUrl = null;
    this.backgroundUrl = null;

    this.loadNewGif = this.loadNewGif.bind(this);
    this.populateGifArray = this.populateGifArray.bind(this);
    this._onJsonReady = this._onJsonReady.bind(this);
    this._onResponse = this._onResponse.bind(this);
    this.preloadNextGif = this.preloadNextGif.bind(this);
  }

  preloadNextGif(event){
    const MAX_RESULTS_LENGTH = 25;
    if(event !== undefined) this.numGifsLoaded++;
    if(this.numGifsLoaded === MAX_RESULTS_LENGTH) return;
    if(this.numGifsLoaded === 0){ // no gifs have been loaded yet
      let myImage = new Image();
      myImage.src = this.gifsToPreload[0];
      myImage.addEventListener('load',this.preloadNextGif);
    } else {
      const url = event.target.src;
      this.gifUrlArray.push(url);
      if(this.numGifsLoaded === 2){ // ready to start playing music
        const eventInfo = {
              nothing: null
        };
        document.dispatchEvent(new CustomEvent('ready-to-start-playing-song', { detail: eventInfo }));
      }

      let myImage = new Image();
      myImage.src = this.gifsToPreload[this.numGifsLoaded];
      myImage.addEventListener('load',this.preloadNextGif);

    }

  }

  _onJsonReady(json) {
      if (!json) {
        return;
      }

      if(json.data.length < 2){
        const eventInfo = {
              nothing: null
        };
        document.dispatchEvent(new CustomEvent('too-few-gifs-found', { detail: eventInfo }));
        return;
      }

      for (const result of json.data) {
        const url = result.images.downsized.url;
        this.gifsToPreload.push(url);
      }

      this.preloadNextGif();
    }

  _onResponse(response) {
    return response.json();
  }

  populateGifArray(currentQuery){
    this.gifUrlArray = [];
    if(currentQuery === ""){ // random when no theme typed in
      const GIPHY_TRENDING_PATH = 'https://api.giphy.com/v1/gifs/trending?&rating=g&api_key=dc6zaTOxFJmzC';
      fetch(GIPHY_TRENDING_PATH)
        .then(this._onResponse)
        .then(this._onJsonReady);
    } else { // when theme typed in
      const GIPHY_SEARCH_PATH = 'https://api.giphy.com/v1/gifs/search?q=';
      const query = encodeURIComponent(currentQuery);
      fetch(GIPHY_SEARCH_PATH + query + '&limit=25&rating=g&api_key=dc6zaTOxFJmzC')
        .then(this._onResponse)
        .then(this._onJsonReady);
    }

  }

  loadNewGif(currentQuery){
    if(this.gifUrlArray.length === 2){
      this.foregroundUrl = this.gifUrlArray[0];
      this.backgroundUrl = this.gifUrlArray[1];
      let foregroundContainer = document.querySelector('.gif-display-area .foreground-gif');
      let backgroundContainer = document.querySelector('.gif-display-area .background-gif');
      foregroundContainer.style.backgroundImage = 'url(' + this.foregroundUrl + ')';
    } else {
      while(true){
        let randomGifUrl = this.gifUrlArray[Math.floor(Math.random() *  this.gifUrlArray.length)];
        if(this.currentGifUrl === null || this.currentGifUrl !== randomGifUrl){
          let foregroundContainer = document.querySelector('.gif-display-area .foreground-gif');
          let backgroundContainer = document.querySelector('.gif-display-area .background-gif');
          if(this.isForegroundGifDisplayed){ // switch to background div
            foregroundContainer.style.zIndex = 0;
            this.isForegroundGifDisplayed = false;
            this.isBackgroundGifDisplayed = true;
            this.foregroundUrl = randomGifUrl;
            backgroundContainer.style.zIndex = 2;
            backgroundContainer.style.backgroundImage = 'url(' + this.backgroundUrl + ')';
          } else { // switch to foreground div
            backgroundContainer.style.zIndex = 0;
            this.isBackgroundGifDisplayed = false;
            this.isForegroundGifDisplayed = true;
            this.backgroundUrl = randomGifUrl;
            foregroundContainer.style.zIndex = 2;
            foregroundContainer.style.backgroundImage = 'url(' + this.foregroundUrl + ')';
          }
          this.currentGifUrl = randomGifUrl;
          break;
        }
      }
    }


  }
}
