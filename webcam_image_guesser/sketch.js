let mobilenet;
let video;
let classImage;
let gifImage;
let label = '';

const API_KEY = '12747684-e15a8dc03b1ec630217b480e1';
const NOT_FOUND_URL = "broken.png"
const SLEEP_TIME = 5000;

const USE_GIF = true

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function gifQuery(query) {
  const url = "https://api.giphy.com/v1/gifs/search?q=" + query + "&api_key=FXf2ee4Xk09SGtLhVfZhOBoCHSegesBP&limit=20"
  let response = await fetch(url);
  let data = await response.json();
  if (data.data.length > 0) {
    const rand = Math.floor(Math.random() * data.data.length);
    return data.data[rand].images.original.url
  } else {
    return NOT_FOUND_URL;
  }
}

async function imageQuery(query) {
  const url = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(query);
  let response = await fetch(url);
  let data = await response.json();
  if (data.hits.length > 0){
    const rand = data.hits[Math.floor(Math.random() * data.hits.length)];
    return rand.webformatURL;
  } else {
    return NOT_FOUND_URL;
  }
}

function modelReady() {
  mobilenet.predict(gotResults);
}

async function gotResults(error, results) {
  if (error) {
    console.log(error);
  } else {
    label = results[0].label.split(",")[0];
    if (USE_GIF) {
      url = await gifQuery(label)
      gifImage = createImg(url);
    } else {
      url = await imageQuery(label)
      loadImage(url, async function(loadedImage) {
        classImage = loadedImage
        await sleep(SLEEP_TIME);
        mobilenet.predict(gotResults);
      });
    }
  }
  await sleep(SLEEP_TIME);
  mobilenet.predict(gotResults);
}

function setup() {
  createCanvas(1280, 480);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  mobilenet = ml5.imageClassifier('MobileNet', video, modelReady);
}

function draw() {
  background(0);
  image(video, 0, 0);
  if (USE_GIF) {
    if (gifImage) {
      gifImage.position(width / 2, 0);
      gifImage.size(width / 2, height);
    }
  } else {
    if (classImage) {
      image(classImage, width / 2, 0, width / 2, height);
    }
  }
  fill(255);
  // textSize(32);
  // text(label, 10, height - 20);
}