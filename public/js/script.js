const generateButton = $(".generate-button");

const swatchOne = $(".one");
const swatchTwo = $(".two");
const swatchThree = $(".three");
const swatchFour = $(".four");
const swatchFive = $(".five");

const labelOne = $(".label-one");
const labelTwo = $(".label-two");
const labelThree = $(".label-three");
const labelFour = $(".label-four");
const labelFive = $(".label-five");

const swatches = [swatchOne, swatchTwo, swatchThree, swatchFour, swatchFive];
const labels = [labelOne, labelTwo, labelThree, labelFour, labelFive];

generateButton.on("click", generateRandomPalette);
$(".swatch").on("click", toggleLockedSwatch);

function assignLabels() {
  labels.map(label => {
    label.text(label.parent().css("backgroundColor"));
  });
}

function generateRandomNumber() {
  return Math.round(Math.random() * 255);
}

function generateRandomRGB() {
  return `rgb(${generateRandomNumber()}, ${generateRandomNumber()}, ${generateRandomNumber()})`;
}

function generateRandomPalette() {
  return swatches.map(swatch => {
    if (!swatch.hasClass("locked")) {
      assignLabels();
      swatch.css("background-color", generateRandomRGB());
    }
  });
}

function toggleLockedSwatch() {
  this.classList.toggle("locked");
}
