let mobilenet;
let video;
let classImage;
let label = '';

const API_KEY = '12747684-e15a8dc03b1ec630217b480e1';
const NOT_FOUND_URL = "broken.png"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    console.error(error);
  } else {
    label = results[0].label.split(",")[0];
    console.log(label.split(",")[0]);
    url = await imageQuery(label)
    classImage = loadImage(url)
    await sleep(2000);
    mobilenet.predict(gotResults);
  }
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
  if (classImage) {
    image(classImage, width / 2, 0, width / 2, height);
  }
  fill(255);
  textSize(32);
  // text(label, 10, height - 20);
}