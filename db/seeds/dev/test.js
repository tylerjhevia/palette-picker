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
  { project_name: "Important", id: 1 },
  { project_name: "Colorz", id: 2 },
  { project_name: "Go Gators", id: 3 }
];

const palettesData = [
  {
    palette_name: "Warm",
    color_1: "rgb(117, 97, 0)",
    color_2: "rgb(102, 33, 167)",
    color_3: "rgb(7, 24, 111)",
    color_4: "rgb(77, 129, 8)",
    color_5: "rgb(150, 242, 98)"
  },
  {
    palette_name: "Subdued",
    color_1: "rgb(29, 170, 63)",
    color_2: "rgb(62, 198, 193)",
    color_3: "rgb(46, 183, 130)",
    color_4: "rgb(188, 27, 228)",
    color_5: "rgb(237, 237, 130)"
  },
  {
    palette_name: "Neon",
    color_1: "rgb(169, 143, 221)",
    color_2: "rgb(15, 54, 222)",
    color_3: "rgb(229, 36, 248)",
    color_4: "rgb(220, 2, 71)",
    color_5: "rgb(104, 202, 3)"
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
