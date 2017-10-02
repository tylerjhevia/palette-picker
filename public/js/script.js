const generateButton = $(".generate-button");

const swatchOne = $(".one");
const swatchTwo = $(".two");
const swatchThree = $(".three");
const swatchFour = $(".four");
const swatchFive = $(".five");

const swatches = [swatchOne, swatchTwo, swatchThree, swatchFour, swatchFive];

generateButton.on("click", generateRandomPalette);

function generateRandomNumber() {
  return Math.round(Math.random() * 255);
}

function generateRandomRGB() {
  let randomRGB = `rgb(${generateRandomNumber()}, ${generateRandomNumber()}, ${generateRandomNumber()})`;
  return randomRGB;
}

function generateRandomPalette() {
  return swatches.map(swatch => {
    swatch.css("background-color", generateRandomRGB());
  });
}
