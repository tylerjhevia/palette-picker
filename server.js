const express = require("express"); // importing express from node modules
const app = express(); // creating an instance of express
const environment = process.env.NODE_ENV || "development"; // environment defaults to "development" if one isn't specified
const configuration = require("./knexfile")[environment]; // lets knexfile configure the database for all of my environments
const database = require("knex")(configuration); // setting up database
const http = require("http"); // I don't know if I need this
const bodyParser = require("body-parser"); // parses responses from requests
const cors = require("express-cors"); // importing express-cors from my node modules
const path = require("path"); // need this to serve up my static files

app.use(express.static(path.join(__dirname, "public"))); // serving up files from public directory

app.use(cors()); // applies cors to every request
app.use(function(req, res, next) {
  // I copied and pasted these lines from Jeff's cors lesson. They determine how the server can be accessed
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE"); // allows me to make GET, PUT, POST, and DELETE requests to the server
  next();
});

app.use(bodyParser.json()); // applies body parser to all of my responses
app.use(bodyParser.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000); // sets port to 3000 if no port is specified

app.listen(app.get("port"), () => {
  // updates server with changes I make to code
  console.log(`${app.locals.title} is running on ${app.get("port")}.`);
});

app.get("/api/v1/projects", (request, response) => {
  // get request to fetch all saved projects
  database("projects") // database I want to get data from
    .select() // select all rows in database
    .then(projects => {
      // if the response code is 200, return the fetched projects
      response.status(200).json(projects);
    })
    .catch(error => {
      // if the response code is 500, return the error
      response.status(500).json({ error });
    });
});

app.get("/api/v1/palettes/:project_id", (request, response) => {
  // get request to get all of a project's saved palettes
  database("palettes") // database I want to get data from
    .where("project_id", request.params.project_id) // select all rows where the value in column project_id is equal to the id value in the params
    .select()
    .then(palettes => {
      if (palettes.length) {
        // check to see if any palettes are found for given project_id
        response.status(200).json(palettes); // if the response code is 200, return the array of palettes
      } else {
        response.status(404).json({
          // if there are no palettes that match the project_id, return an error message
          error: "Could not find any palettes with the given project_id"
        });
      }
    })
    .catch(error => {
      // if the status code is 500, return the error
      response.status(500).json({ error });
    });
});

app.post("/api/v1/projects", (request, response) => {
  // post request to save a new project
  database("projects") // database I'm targeting
    .insert(
      // insert a new row into the database when the request body matches this format
      {
        project_name: request.body.project_name
      },
      "*" // return the entire row as response
    )
    .then(projectId => {
      // return the row when the request is successful
      response.status(201).json(projectId[0]);
    })
    .catch(error => {
      // return an error when the request is unsuccessful
      response.status(500).json({ error });
    });
});

app.post("/api/v1/palettes", (request, response) => {
  // post request to save a new palette
  database("palettes") // adding to palettes database
    .insert(
      // insert a row into the palettes database when the request.body matches this format
      {
        palette_name: request.body.palette_name,
        color_1: request.body.color_1,
        color_2: request.body.color_2,
        color_3: request.body.color_3,
        color_4: request.body.color_4,
        color_5: request.body.color_5,
        project_id: request.body.project_id
      },
      "id" // return the row's id value in response
    )
    .then(paletteId => {
      // return the id if status code is 201
      response.status(201).json(paletteId);
    })
    .catch(error => {
      // return an error if status code is 500
      response.status(500).json({ error });
    });
});

app.delete("/api/v1/projects/:id", (request, response) => {
  // delete request to remove a project
  database("projects") // deleting from projects database
    .where("id", request.params.id) // delete row where id column is equal to request.params.id
    .delete()
    .then(response => {
      // response for 204 status code
      response.status(204).json(response);
    })
    .catch(error => response.status(500).json({ error })); // return error for 500 status code
});

app.delete("/api/v1/palettes/delete/:id", (request, response) => {
  // delete request to remove a palette
  database("palettes") // deleting from palettes database
    .where("id", request.params.id) // delete row where value in id column is equal to request.params.id
    .delete()
    .then(response => {
      // response for 204 status code
      response.status(204).json(response);
    })
    .catch(error => response.status(500).json({ error })); // return error if 500 status code
});

module.exports = app; // exporting the instance of express
