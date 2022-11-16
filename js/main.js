/* --------------------------------------------------
-----------------------WARNING-----------------------
-----------------------------------------------------

If you'd like to use this system, you need to get a TMDB API key.
1)  You have to create an account.
    TMDB is here.
    https://www.themoviedb.org/
2)  You should change code which is comment outed and paste your API key.
    Line  17
    const TMDB_API_key = (your api key)
    Note) I (the creater) set my own API key on the config.js
    It should not be added to GitHub.
*/

// Declaration
// const TMDB_API_key = (your api key) 
const TMDB_URL_ROOT = "https://api.themoviedb.org/3/"

// I don't know how to use these variable as local variables instead of global ones
// So at this point, I left them as they were.
let candidatedMovie = []
let movieObjArr = []
let originalTitle = ""
let baseURL = "";
let directorName = "";

/* --------------------------------------------------
-------------------- Constructor ----------------------
-----------------------------------------------------*/
class Movie {

  constructor(langSearchKey, id, original_title, title, release_date, genres, vote_average, overview, tagline, poster, backdrop_path) {
    this.language = langSearchKey;
    this.id = id;
    this.original_title = original_title;
    this.title = title;
    this.release_date = release_date;
    this.genres = genres;
    this.vote_average = vote_average;
    this.overview = overview;
    this.tagline = tagline;
    this.poster = poster;
    this.backdrop_path = backdrop_path
  }

  setData() {
    let LANGAGE = this.language === "en-US" ? "En" : "Ja";
    let posterSize = "w342";
    let backdropSize = "w1280";
    const title_El = document.querySelector(`#title_${LANGAGE}`);
    const description_El = document.querySelector(`#description_${LANGAGE}`);
    const poster_El = document.querySelector(`#poster_${LANGAGE}`);
    const tagline_El = document.querySelector(`#tagline_${LANGAGE}`);

    title_El.innerText = this.title;
    description_El.innerText = this.overview;
    tagline_El.innerText = this.tagline;
    poster_El.src = `${baseURL}${posterSize}${this.poster}`

    if (this.language === "en-US") {
      const release_El = document.querySelector("#release");
      const genres_El = document.querySelector("#genres");
      const vote_average_El = document.querySelector("#userScore");
      const container_El = document.querySelector(`#container`);
      release_El.innerText = `(${this.release_date.slice(0, 4)})`;
      genres_El.innerText = this.genres.map(item => item.name);
      vote_average_El.innerText = Math.floor(Number(this.vote_average) * 10);
      container_El.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7)),url(${baseURL}${backdropSize}${this.backdrop_path})`
    }
  }
}

/* --------------------------------------------------
-------------------- Process 1 ----------------------
-----------------------------------------------------*/
// Search Ghibli Movie's Title by its name (both English title and Japanese title)
function getTitle(langSearchKey) {
  const userChoice_El = document.querySelector('#search')
  const GENRES_ANIME_ID = 16 // Animation is 16
  const TMDB_URL = `${TMDB_URL_ROOT}search/movie?api_key=`
  const TMDB_SEARCH_URL = `${TMDB_URL}${TMDB_API_key}&language=${langSearchKey}&query=${encodeURI(userChoice_El.value)}`
  return fetch(TMDB_SEARCH_URL)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      // Check original_language and genre_ids
      // CandidatedMovie will be original_language === "ja" and genre_ids include 16 (Animation)
      const candidatedMovie = data.results.filter(item => item.original_language === "ja" && item.genre_ids.includes(GENRES_ANIME_ID));
      return candidatedMovie;
    })
}

/* --------------------------------------------------
-------------------- Process 2 ----------------------
-----------------------------------------------------*/
// Search candidated movies from TMDB and find whether its production_companies' ID includes Ghibli ID or not.
function searchCandidatedMovie(candidatedMovie, langSearchKey) {
  const GHIBLI_ID = "10342" // Ghibli ID
  const TOPCRAFT_ID = "29" //"Nausicaa of the Valley of the Wind" was made by TopCraft instead of Ghibli.

  const TMDB_SEARCH_BY_ID_URL = `${TMDB_URL_ROOT}movie/${candidatedMovie.id}?api_key=${TMDB_API_key}&language=${langSearchKey}`
  return fetch(TMDB_SEARCH_BY_ID_URL)
    .then(res => res.json())
    .then(data => {
      // Check production_companies
      if (data.production_companies.some(item => item.id == GHIBLI_ID || item.id == TOPCRAFT_ID)) {
        switch (langSearchKey) {
          case "en-US":
            const EnglishMovie = new Movie(langSearchKey, data.id, data.original_title, data.title, data.release_date, data.genres, data.vote_average, data.overview, data.tagline, data.poster_path, data.backdrop_path)
            movieObjArr.push(EnglishMovie);
            break;
          case "ja":
            const JapaneseMovie = new Movie(langSearchKey, data.id, data.original_title, data.title, data.release_date, data.genres, data.vote_average, data.overview, data.tagline, data.poster_path, data.backdrop_path)
            movieObjArr.push(JapaneseMovie)
            break;
        }
      }
      return movieObjArr;
    });
}

/* --------------------------------------------------
-------------------- Process 3-1 ----------------------
-----------------------------------------------------*/
function checkMoovieNum(langSearchKey) {
  const errorMsg_El = document.querySelector('#errorMsg');
  const main_El = document.querySelector('main');
  const footer_El = document.querySelector('footer');
  let errorMsg = "";

  switch (langSearchKey) {
    case "en-US":
      if (movieObjArr.length == 0) {
        errorMsg = "I can't find any movies."
        errorMsg_El.innerText = errorMsg;
        errorMsg_El.classList.remove('hidden');
        main_El.classList.add("hidden");
        footer_El.classList.add("hidden");
      } else if (movieObjArr.length > 1) {
        errorMsg = `I found ${movieObjArr.length} movies.
${movieObjArr.map(item => item.title)}
Which movie are you looking for?`
        errorMsg_El.innerText = errorMsg;
        errorMsg_El.classList.remove('hidden')
        main_El.classList.add("hidden");
        footer_El.classList.add("hidden");
      } else {
        // Search Japanese ver. Both English ver and Japanese one have the same ID.
        errorMsg_El.innerText = errorMsg;
        errorMsg_El.classList.add('hidden');
        getAnotherVerMovie(langSearchKey)
      }
      break;

    case "ja":
      if (movieObjArr.length == 0) {
        errorMsg = "該当する映画がありません。"
        errorMsg_El.innerText = errorMsg;
        errorMsg_El.classList.remove('hidden')
        main_El.classList.add("hidden");
        footer_El.classList.add("hidden");
      } else if (movieObjArr.length > 1) {
        errorMsg = `${movieObjArr.length} 件の映画が該当しました。
      ${movieObjArr.map(item => item.original_title)} です。
再度検索をお試しください。`
        errorMsg_El.innerText = errorMsg;
        errorMsg_El.classList.remove('hidden')
        main_El.classList.add("hidden");
        footer_El.classList.add("hidden");
      } else {
        // Search English ver. Both English ver and Japanese one have the same ID.
        errorMsg_El.innerText = errorMsg;
        errorMsg_El.classList.add('hidden');
        getAnotherVerMovie(langSearchKey)
      }
      break;
  }
}

/* --------------------------------------------------
-------------------- Process 3-2 ----------------------
-----------------------------------------------------*/
async function getAnotherVerMovie(langSearchKey) {

  switch (langSearchKey) {
    case "en-US":
      langSearchKey = "ja";
      break;
    case "ja":
      langSearchKey = "en-US";
      break;
  }

  const candidatedMovie = Object.assign({}, JSON.parse(JSON.stringify(movieObjArr[0])));
  await Promise.all([searchCandidatedMovie(candidatedMovie, langSearchKey), getConfig(), getDirector(candidatedMovie)]);
  setMovieData()
  showMain()
}

/* --------------------------------------------------
-------------------- Process 3-3 ----------------------
-----------------------------------------------------*/
function getConfig() {
  //get config
  const TMDB_SEARCH_CONFIG_URL = `${TMDB_URL_ROOT}configuration?api_key=${TMDB_API_key}`
  return fetch(TMDB_SEARCH_CONFIG_URL)
    .then(res => res.json())
    .then(data => {
      baseURL = data.images.base_url
      return baseURL;
    });
}

/* --------------------------------------------------
-------------------- Process 3-4 ----------------------
-----------------------------------------------------*/
function getDirector(candidatedMovie) {
  // get director
  const TMDB_SEARCH_BY_ID_URL = `${TMDB_URL_ROOT}movie/${candidatedMovie.id}/credits?api_key=${TMDB_API_key}`
  return fetch(TMDB_SEARCH_BY_ID_URL)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      const director = data.crew.filter(item => item.job === "Director")
      directorName = director.map(item => item.name);

      // set Director
      const director_El = document.querySelector("#director");
      director_El.innerText = directorName.join("")

      return directorName;
    })
}

/* --------------------------------------------------
-------------------- Process 3-5 ----------------------
-----------------------------------------------------*/
function setMovieData() {

  movieObjArr.forEach(item => item.setData());

}

/* --------------------------------------------------
-------------------- Process 3-6 ----------------------
-----------------------------------------------------*/
function showMain() {

  const main_El = document.querySelector('main')
  const footer_El = document.querySelector('footer')

  main_El.classList.remove("hidden");
  footer_El.classList.remove("hidden");
}

/* ---------------------------------------------------
---- Function called by a click button ---------------
-----------------------------------------------------*/
async function getMovie() {

  movieObjArr = []
  let movieObj = {};
  let langSearchKey = ""
  let lang = document.querySelector('#display-language').value;

  switch (lang) {
    case "En": {
      langSearchKey = "en-US"
      break;
    }
    case "Ja": {
      langSearchKey = "ja"
      break;
    }
  }

  const candidatedMovie = await getTitle(langSearchKey);
  const promises = candidatedMovie.map((item) => searchCandidatedMovie(item, langSearchKey));
  await Promise.all(promises);
  await checkMoovieNum(langSearchKey);

}

/* ---------------------------------------------------
---- Function called by a langChange button ---------------
-----------------------------------------------------*/
// change Language English <-----> Japanese
function changeLang(language) {
  let AddClassItems = ""
  let RemoveClassItems = ""
  const LANG_En = ".showEn";
  const LANG_Ja = ".showJa";
  const userChoice_El = document.querySelector('#search')
  const placeholder_En = "Enter the movie name";
  const placeholder_Ja = "キーワードを入力してください";
  const langEl = document.querySelector('#display-language');

  // Japanese --> English
  if (language === "En") {
    AddClassItems = LANG_Ja;
    RemoveClassItems = LANG_En;
    langEl.value = "En";
    userChoice_El.placeholder = placeholder_En;
    // English --> Japanese
  } else if (language === "Ja") {
    AddClassItems = LANG_En;
    RemoveClassItems = LANG_Ja;
    langEl.value = "Ja";
    userChoice_El.placeholder = placeholder_Ja;
  } else {
    console.log("I'm sorry. Something is wrong!")
  }

  const Items = document.querySelectorAll(AddClassItems);

  // Items.forEach(function (item) {
  //   item.classList.add('hidden');
  // });

  Items.forEach(item =>
    item.classList.add('hidden')
  );

  const RemoveItems = document.querySelectorAll(RemoveClassItems);
  // RemoveItems.forEach(function (item) {
  //   item.classList.remove('hidden');
  // });
  RemoveItems.forEach(item =>
    item.classList.remove('hidden')
  );
}


// ------------------------------
// Main Function AddEventListener
// ------------------------------
//Run FUNCTION
const searchBtn = document.querySelector('#searchBtn')
searchBtn.addEventListener('click', getMovie)

//Run Function
const langChangeToJP = document.querySelector('#langChangeToJP')
langChangeToJP.addEventListener('click', function (e) {
  changeLang('Ja');
});

//Run Function
const langChangeToEN = document.querySelector('#langChangeToEN')
langChangeToEN.addEventListener('click', function (e) {
  changeLang('En');
});