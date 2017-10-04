const express = require("express");
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const http = require("http");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log(`${app.locals.title} is running on ${app.get("port")}.`);
});

app.get("/projects", (request, response) => {
  database("projects")
    .select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post("/projects", (request, response) => {
  database("projects")
    .insert(
      {
        name: request.body.name,
        palettes: request.body.palettes,
        id: request.body.id
      },
      "*"
    )
    .then(project => {
      response.status(201).json(project);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});
