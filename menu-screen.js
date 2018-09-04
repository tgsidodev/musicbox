// This class will represent the menu screen that you see when you first load
// the music visualizer.
//
// See HW4 writeup for more hints and details.
const myMusicObj = {
  "cranes": {
    "songUrl": "https://yayinternet.github.io/hw4-music/songs/solange-cranes-kaytranada.mp3",
    "title": "Cranes in the Sky [KAYTRANADA Remix]",
    "artist": "Solange"
  },
  "timeless": {
    "songUrl": "https://yayinternet.github.io/hw4-music/songs/james-blake-timeless.mp3",
    "title": "Timeless",
    "artist": "James Blake"
  },
  "knock": {
    "songUrl": "https://yayinternet.github.io/hw4-music/songs/knockknock.mp4",
    "title": "Twice",
    "artist": "Knock Knock"
  },
  "deep": {
    "songUrl": "https://yayinternet.github.io/hw4-music/songs/janet-jackson-go-deep.mp3",
    "title": "Go Deep [Alesia Remix]",
    "artist": "Janet Jackson"
  },
  "discretion": {
    "songUrl": "https://yayinternet.github.io/hw4-music/songs/mitis-innocent-discretion.mp3",
    "title": "Innocent Discretion",
    "artist": "MitiS"
  },
  "spear": {
    "songUrl": "https://yayinternet.github.io/hw4-music/songs/toby-fox-spear-of-justice.mp3",
    "title": "Spear of Justice (ALMOST NO KICKS)",
    "artist": "Toby Fox"
  }
};

class MenuScreen {
  constructor() {
    this.containerElement = document.querySelector('#menu');
    this.songList = [];
    this.songUrls = [];

    this.populateMenuScreen = this.populateMenuScreen.bind(this);
    this._onJsonReady = this._onJsonReady.bind(this);
    this._onResponse = this._onResponse.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this.submitUserSelections = this.submitUserSelections.bind(this);
    this._renderSongOptions = this._renderSongOptions.bind(this);
    this._renderRandomThemeOption = this._renderRandomThemeOption.bind(this);


    this.form = document.querySelector('form');
    this.form.addEventListener('submit', this._onSubmit);

  //  this.populateMenuScreen();

    this._onJsonReady(myMusicObj);
  /*  var xmlhttp = new XMLHttpRequest();
    var url = "https://yayinternet.github.io/hw4-music/songs.json";

    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          console.log(myArr);
          }
      };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();*/
  }

  show() {
    this.containerElement.classList.remove('inactive');
    let errorContainer = document.querySelector('#error');
    errorContainer.classList.add('inactive');
  }

  hide() {
    console.log('hiding menuScreen');
    this.containerElement.classList.add('inactive');
  }


  _onJsonReady(json) {

   if (!json) {
     return;
   }

   for (const item in json) {
     const songObj = json[item];
     const songTitle = songObj.title;
     console.log(songTitle);
     this.songList.push(songTitle);
     this.songUrls.push(songObj.songUrl);
   }

   this._renderSongOptions();
   this._renderRandomThemeOption();

 }

 _onResponse(response) {
   return response.json();
 }

 _onSubmit(event) {
    event.preventDefault();

    // theme selection
    const themeInput = document.querySelector('#query-input');
    const themeSelection = themeInput.value;
    console.log("themeSelection: " + themeSelection);

    // song selection
    const songSelectorContainer = document.querySelector('#song-selector');
    const index = songSelectorContainer.selectedIndex;
    const songSelection = songSelectorContainer.options[index].value;
    console.log("songSelection: " + songSelection);
    const songUrl = this.songUrls[index];
    this.submitUserSelections(themeSelection, songSelection,songUrl);

  }

  /* Send +1/-1/0 to change score back to app class */
  submitUserSelections(themeSelection, songSelection,songUrl){
    const eventInfo = {
          themeSelection: themeSelection,
          songSelection: songSelection,
          songUrl: songUrl
    };
    document.dispatchEvent(new CustomEvent('user-selections-submitted', { detail: eventInfo }));
  }


  populateMenuScreen(){
    fetch('https://yayinternet.github.io/hw4-music/songs.json')
        .then(this._onResponse)
        .then(this._onJsonReady);
  }

  _renderSongOptions(){
    //debugger;
    const songSelectorContainer = document.querySelector('#song-selector');

    // event listener for different song selections
    songSelectorContainer.addEventListener('change', function() {
      const index = songSelectorContainer.selectedIndex;
      console.log('index selected: ' + index);
      console.log('option selected: ' + songSelectorContainer.options[index].value);
    })

    // populating container with various song titles
    songSelectorContainer.innerHTML = '';
    for (const songTitle of this.songList) {
      let newOption = document.createElement("option");
      newOption.textContent = songTitle;
      songSelectorContainer.appendChild(newOption);
    }

  }

  _renderRandomThemeOption(){
    const themes = ['candy', 'charlie brown', 'computers', 'dance', 'donuts',
    'hello kitty', 'flowers', 'nature', 'turtles', 'space'];
    const themeInput = document.querySelector('#query-input');
    themeInput.value = themes[Math.floor(Math.random() * themes.length)];
  }


}
