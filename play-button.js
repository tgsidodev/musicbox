// This class will represent the play button in the MusicScreen. Clicking on
// it toggles audio playback.
//
// See HW4 writeup for more hints and details.
class PlayButton {
  constructor() {
    this.isPlay = false;

    this._playButtonClick = this._playButtonClick.bind(this);
    this.showPlayButton = this.showPlayButton.bind(this);
    this.showPauseButton = this.showPauseButton.bind(this);

    this.img = document.querySelector('.play-button-area img');
    this.img.addEventListener('click', this._playButtonClick);
  }

  showPlayButton(){
    this.img.src = "images/play.png";
  }

  showPauseButton(){
    this.img.src = "images/pause.png";
  }

  _playButtonClick() {
    const isPlay = this.isPlay;
    this.isPlay = !this.isPlay;
    const eventInfo = {
          isPlay: isPlay
    };
    document.dispatchEvent(new CustomEvent('play-button-clicked', { detail: eventInfo }));

  }
}
