const generateButton = $(".generate-button");
const createProjectButton = $(".create-project-button");
const createPaletteButton = $(".create-palette-button");

let currentProjectId = 1;

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

fetchAllProjects();

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

function assignLabels() {
  labels.map(label => {
    label.text(label.parent().css("backgroundColor"));
  });
}

function toggleLockedSwatch() {
  this.classList.toggle("locked");
}

function getPaletteInfo() {
  let colorsObject = swatches.reduce((acc, color, index) => {
    acc[`color_${index + 1}`] = color.css("backgroundColor");
    return acc;
  }, {});
  let currentColors = swatches.map(color => color.css("backgroundColor"));
  savePaletteToDB(colorsObject);
}

function fetchAllProjects() {
  $(".saved-projects").empty();
  return fetch("http://localhost:3000/api/v1/projects")
    .then(res => res.json())
    .then(res => appendAllProjects(res))
    .catch(error => console.log(error));
}

function appendAllProjects(projects) {
  projects.map(project => appendOneProject(project));
}

function appendOneProject(project) {
  const { project_name, id } = project;
  return $(".saved-projects").append(`<div class="project">
    <h3 class="saved-project-title">${project_name}</h3> 
    <p class='project_id'>${id}</p>
  </div>`);
}

function fetchProject(e) {
  const id = this.innerHTML;
  fetch(`http://localhost:3000/api/v1/palettes/${id}`)
    .then(res => res.json())
    .then(res => displayCurrentPalettes(res));
}

function createProject() {
  const projectName = $(".project-name-input").val();
  $(".selected-project").text(`Selected Project: ${projectName}`);
  $(".project-name-input").val("");
  saveProjectToDB(projectName);
}

function saveProjectToDB(projectName) {
  fetch("http://localhost:3000/api/v1/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_name: projectName })
  })
    .then(res => res.json())
    .then(res => {
      currentProjectId = res.id;
      fetchProject();
      fetchAllProjects();
    });
}

function savePaletteToDB(colors) {
  const { color_1, color_2, color_3, color_4, color_5 } = colors;
  const paletteName = $(".palette-name-input").val();
  fetch("http://localhost:3000/api/v1/palettes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      palette_name: paletteName,
      color_1: color_1,
      color_2: color_2,
      color_3: color_3,
      color_4: color_4,
      color_5: color_5,
      project_id: currentProjectId
    })
  })
    .then(res => res.json())
    .then(res => fetchProject());
}

function displayCurrentPalettes(palettes) {
  $(".current-palettes").empty();
  palettes.length
    ? palettes.map(palette => {
        $(".current-palettes")
          .append(`<div class="current-palette"><h4>${palette.palette_name}</h4>
    <div class='color-square' style="background-color:${palette.color_1}"></div>
    <div class='color-square' style="background-color:${palette.color_2}"></div>
    <div class='color-square' style="background-color:${palette.color_3}"></div>
    <div class='color-square' style="background-color:${palette.color_4}"></div>
    <div class='color-square' style="background-color:${palette.color_5}"></div>
  </div>`);
      })
    : showEmptyMessage();
}

function showEmptyMessage() {
  $(".current-palettes").empty();
  $(".current-palettes").append(
    `<p class='empty-message'>This project has no saved palettes!</p>`
  );
}

function displaySelectedPalette() {
  let selectedPalette = this.children;

  swatchOne.css("background-color", selectedPalette[1].style.backgroundColor);
  swatchTwo.css("background-color", selectedPalette[2].style.backgroundColor);
  swatchThree.css("background-color", selectedPalette[3].style.backgroundColor);
  swatchFour.css("background-color", selectedPalette[4].style.backgroundColor);
  swatchFive.css("background-color", selectedPalette[5].style.backgroundColor);
  assignLabels();
}
generateButton.on("click", generateRandomPalette);
$(".swatch").on("click", toggleLockedSwatch);
createProjectButton.on("click", createProject);
createPaletteButton.on("click", getPaletteInfo);
$(".saved-projects").on("click", ".project_id", fetchProject);
$(".current-palettes").on("click", ".current-palette", displaySelectedPalette);
