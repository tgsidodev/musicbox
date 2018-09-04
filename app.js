/*app.js*/
class App {
  constructor() {
    this.menuScreen = new MenuScreen();
    this.musicScreen = new MusicScreen();

    this.onUserSelectionsSubmitted = this.onUserSelectionsSubmitted.bind(this);
    this.onInsufficientGifs = this.onInsufficientGifs.bind(this);

    document.addEventListener('user-selections-submitted', this.onUserSelectionsSubmitted);
    document.addEventListener('insufficient-gifs', this.onInsufficientGifs);
  }

  onUserSelectionsSubmitted(event){
    const songSelection = event.detail.songSelection;
    const themeSelection = event.detail.themeSelection;
    const songUrl = event.detail.songUrl;
    this.menuScreen.hide();
    this.musicScreen.show();
    this.musicScreen.setupNewDisplay(songSelection,themeSelection,songUrl);
  }

  onInsufficientGifs(){
    console.log('insufficient gif in app.js');
    this.musicScreen.hide();
    this.menuScreen.show();
    let errorContainer = document.querySelector('#error');
    errorContainer.classList.remove('inactive');
  }

}
