const generateButton = $(".generate-button");
const createProjectButton = $(".create-project-button");
const createPaletteButton = $(".create-palette-button");

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
      assignLabels(); // probably need to find a better place for this
      swatch.css("background-color", generateRandomRGB());
    }
  });
}

function toggleLockedSwatch() {
  this.classList.toggle("locked");
}

function getPaletteInfo() {
  let colorsObject = swatches.reduce((acc, color, index) => {
    acc[ind] = color.css("backgroundColor");
  });
  console.log("colorsObject", colorsObject);

  let currentColors = swatches.map(color => color.css("backgroundColor"));
  console.log(currentColors);
}

function appendProject() {
  const projectName = $(".project-name-input").val();
  const savedProjects = $(".saved-projects");
  return savedProjects.append(`<div class="${projectName}">
    <h3 class="saved-project-title">${projectName}</h3>
  </div>`);
}

generateButton.on("click", generateRandomPalette);
$(".swatch").on("click", toggleLockedSwatch);
createProjectButton.on("click", appendProject);
createPaletteButton.on("click", getPaletteInfo);
