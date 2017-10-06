const express = require("express");
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("express-cors");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log(`${app.locals.title} is running on ${app.get("port")}.`);
});

app.get("/api/v1/projects", (request, response) => {
  database("projects")
    .select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get("/api/v1/palettes/:project_id", (request, response) => {
  database("palettes")
    .where("project_id", request.params.project_id)
    .select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({
          error: "Could not find any palettes with the given project_id"
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post("/api/v1/projects", (request, response) => {
  database("projects")
    .insert(
      {
        project_name: request.body.project_name
      },
      "*"
    )
    .then(projectId => {
      response.status(201).json(projectId[0]);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post("/api/v1/palettes", (request, response) => {
  database("palettes")
    .insert(
      {
        palette_name: request.body.palette_name,
        color_1: request.body.color_1,
        color_2: request.body.color_2,
        color_3: request.body.color_3,
        color_4: request.body.color_4,
        color_5: request.body.color_5,
        project_id: request.body.project_id
      },
      "id"
    )
    .then(paletteId => {
      response.status(201).json(paletteId);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete("/api/v1/projects/:id", (request, response) => {
  database("projects")
    .where("id", request.params.id)
    .delete()
    .then(response => {
      response.status(204).json(response);
    })
    .catch(error => response.status(500).json({ error }));
});

app.delete("/api/v1/palettes/delete/:id", (request, response) => {
  database("palettes")
    .where("id", request.params.id)
    .delete()
    .then(response => {
      response.status(204).json(response);
    })
    .catch(error => response.status(500).json({ error }));
});

module.exports = app;
