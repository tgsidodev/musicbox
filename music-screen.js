// This class will represent the music visualizer screen, i.e. the screen that
// you see after you select a song.
//
// This class should create and own:
//   - 1 AudioPlayer
//   - 1 GifDisplay
//   - 1 PlayButton
//
// See HW4 writeup for more hints and details.
class MusicScreen {
  constructor() {
    this.containerElement = document.querySelector('#music');
    this.currentQuery = null;
    this.currentSongTitle = null;
    this.songUrl = null;

    this.audioPlayer = new AudioPlayer();
    this.gifDisplay = new GifDisplay();
    this.playButton = new PlayButton();

    this.setupNewDisplay = this.setupNewDisplay.bind(this);
    this.launchNewDisplay = this.launchNewDisplay.bind(this);
    this.kickCallback = this.kickCallback.bind(this);
    this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);
    this.onInsufficientGifsFound = this.onInsufficientGifsFound.bind(this);

    document.addEventListener('play-button-clicked', this.onPlayButtonClicked);
    document.addEventListener('too-few-gifs-found', this.onInsufficientGifsFound);
    document.addEventListener('ready-to-start-playing-song',this.launchNewDisplay);
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  kickCallback(){
    this.gifDisplay.loadNewGif(this.currentQuery);
  }

  onPlayButtonClicked(event){
    const isPlay = event.detail.isPlay;
    console.log('isPlay: ' + isPlay);
    if(isPlay){
      this.audioPlayer.play();
      this.playButton.showPauseButton();
    } else {
      this.audioPlayer.pause();
      this.playButton.showPlayButton();
    }
  }

  setupNewDisplay(songSelection,themeSelection,songUrl){
    this.currentQuery = themeSelection;
    this.currentSongTitle = songSelection;
    this.songUrl = songUrl;
    this.gifDisplay.populateGifArray(this.currentQuery);
  }

  launchNewDisplay(){
    this.gifDisplay.loadNewGif(this.currentQuery);
    this.audioPlayer.setSong(this.songUrl);
    this.audioPlayer.setKickCallback(this.kickCallback);
    this.audioPlayer.play();
  }

  onInsufficientGifsFound(){
    console.log('insufficient gif in music-screen.js');
    this.audioPlayer.pause();
    const eventInfo = {
          nothing: null
    };
    document.dispatchEvent(new CustomEvent('insufficient-gifs', { detail: eventInfo }));
  }

}
