exports.seed = (knex, Promise) => {
  return knex("palettes")
    .del() // delete footnotes first
    .then(() => knex("projects").del()) // delete all papers
    .then(() => {
      let projectsPromises = [];

      projectsData.forEach(project => {
        projectsPromises.push(createProject(knex, project));
      });

      return Promise.all(projectsPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};

const projectsData = [
  { project_name: "bears" },
  { project_name: "tigers" },
  { project_name: "gators" }
];

const palettesData = [
  {
    palette_name: "whatever",
    color_1: "green",
    color_2: "yellow",
    color_3: "orange",
    color_4: "red",
    color_5: "blue"
  },
  {
    palette_name: "rainbow",
    color_1: "magenta",
    color_2: "pink",
    color_3: "rouge",
    color_4: "mauve",
    color_5: "lime"
  },
  {
    palette_name: "boring",
    color_1: "brown",
    color_2: "white",
    color_3: "black",
    color_4: "gray",
    color_5: "beige"
  }
];

const createProject = (knex, project) => {
  return knex("projects")
    .insert(
      {
        project_name: project.project_name
      },
      "id"
    )
    .then(projectId => {
      let projectPromises = [];

      palettesData.forEach(palette => {
        projectPromises.push(
          createPalette(knex, {
            palette_name: palette.palette_name,
            color_1: palette.color_1,
            color_2: palette.color_2,
            color_3: palette.color_3,
            color_4: palette.color_4,
            color_5: palette.color_5,
            project_id: projectId[0]
          })
        );
      });
      return Promise.all(projectPromises);
    });
};

const createPalette = (knex, palette) => {
  return knex("palettes").insert(palette);
};
