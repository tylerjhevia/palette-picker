const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

chai.use(chaiHttp);

before(done => {
  database.migrate
    .latest()
    .then(() => {
      database.seed.run();
    })
    .then(() => done())
    .catch(error => console.log("error", error));
});

describe("Client Routes", () => {
  it("should displlay the homepage", done => {
    chai.request(server).get("/").end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });

  it("should return a 404 for a route that does not exist", done => {
    chai.request(server).get("/nothing").end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe("API Routes", () => {
  beforeEach(done => {
    database.migrate
      .rollback()
      .then(() => database.migrate.latest())
      .then(() => done())
      .catch(error => console.log(error));
  });

  beforeEach(done => {
    database.seed
      .run()
      .then(() => {
        done();
      })
      .catch(error => {
        console.log(error);
      });
  });

  describe("GET /api/v1/projects", () => {
    it("should return all saved projects", done => {
      chai.request(server).get("/api/v1/projects").end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a("array");
        response.body.length.should.equal(3);
        response.body[0].should.have.property("project_name");
        response.body[0].project_name.should.equal("Important");
        response.body[0].should.have.property("id");
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property("created_at");
        response.body[0].created_at.should.be.a("string");
        response.body[0].should.have.property("updated_at");
        response.body[0].updated_at.should.be.a("string");
        done();
      });
    });
  });

  describe("GET /api/v1/palettes/:project_id", () => {
    it("should return palettes for a given project", done => {
      chai.request(server).get("/api/v1/palettes/1").end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a("array");
        response.body.length.should.equal(3);
        response.body[0].should.have.property("palette_name");
        response.body[0].palette_name.should.equal("Warm");
        response.body[0].should.have.property("color_1");
        response.body[0].color_1.should.equal("rgb(117, 97, 0)");
        response.body[0].should.have.property("color_2");
        response.body[0].color_2.should.equal("rgb(102, 33, 167)");
        response.body[0].should.have.property("color_3");
        response.body[0].color_3.should.equal("rgb(7, 24, 111)");
        response.body[0].should.have.property("color_4");
        response.body[0].color_4.should.equal("rgb(77, 129, 8)");
        response.body[0].should.have.property("color_5");
        response.body[0].color_5.should.equal("rgb(150, 242, 98)");
        response.body[0].should.have.property("id");
        response.body[0].id.should.be.a("number");
        response.body[0].should.have.property("project_id");
        response.body[0].project_id.should.equal(1);
        response.body[0].should.have.property("created_at");
        response.body[0].should.have.property("updated_at");
        done();
      });
    });
  });

  describe("POST /api/v1/projects", () => {
    it("should save a new project", done => {
      chai
        .request(server)
        .post("/api/v1/projects")
        .send({
          project_name: "Donuts"
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a("object");
          response.body.should.have.property("project_name");
          response.body.project_name.should.equal("Donuts");
          response.body.should.have.property("id");
          response.body.id.should.be.a("number");
          response.body.should.have.property("created_at");
          response.body.created_at.should.be.a("string");
          response.body.should.have.property("updated_at");
          response.body.updated_at.should.be.a("string");

          chai.request(server).get("/api/v1/projects").end((err, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a("array");
            response.body.length.should.equal(4);
            response.body[3].should.have.property("project_name");
            response.body[3].project_name.should.equal("Donuts");
            response.body[3].should.have.property("id");
            response.body[3].id.should.be.a("number");
            response.body[3].should.have.property("created_at");
            response.body[3].created_at.should.be.a("string");
            response.body[3].should.have.property("updated_at");
            response.body[3].updated_at.should.be.a("string");
            done();
          });
        });
    });
  });

  describe("POST /api/v1/palettes", () => {
    it("should save a new palette", done => {
      chai
        .request(server)
        .post("/api/v1/palettes")
        .send({
          palette_name: "Earthy",
          color_1: "rgb(29, 150, 122)",
          color_2: "rgb(239, 253, 5)",
          color_3: "rgb(172, 179, 99)",
          color_4: "rgb(238, 112, 226)",
          color_5: "rgb(215, 236, 204)",
          project_id: 1
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body[0].should.be.a("number");

          chai
            .request(server)
            .get("/api/v1/palettes/1")
            .end((err, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a("array");
              response.body.length.should.equal(4);
              response.body[3].should.have.property("id");
              response.body[3].id.should.be.a("number");
              response.body[3].should.have.property("palette_name");
              response.body[3].palette_name.should.equal("Earthy");
              response.body[3].should.have.property("color_1");
              response.body[3].color_1.should.equal("rgb(29, 150, 122)");
              response.body[3].should.have.property("color_2");
              response.body[3].color_2.should.equal("rgb(239, 253, 5)");
              response.body[3].should.have.property("color_3");
              response.body[3].color_3.should.equal("rgb(172, 179, 99)");
              response.body[3].should.have.property("color_4");
              response.body[3].color_4.should.equal("rgb(238, 112, 226)");
              response.body[3].should.have.property("color_5");
              response.body[3].color_5.should.equal("rgb(215, 236, 204)");
              response.body[3].should.have.property("created_at");
              response.body[3].created_at.should.be.a("string");
              response.body[3].should.have.property("updated_at");
              response.body[3].updated_at.should.be.a("string");
              done();
            });
        });
    });
  });

  describe("DELETE /api/v1/palettes/delete/:id", () => {
    it("should delete a palette from the database", done => {
      chai.request(server).get("/api/v1/palettes/1").end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a("array");
        response.body.length.should.equal(3);
        response.body[0].should.have.property("id");
        response.body[0].should.have.property("palette_name");
        response.body[0].should.have.property("color_1");
        response.body[0].should.have.property("color_2");
        response.body[0].should.have.property("color_3");
        response.body[0].should.have.property("color_4");
        response.body[0].should.have.property("color_5");
        response.body[0].should.have.property("created_at");
        response.body[0].should.have.property("updated_at");

        chai
          .request(server)
          .delete("/api/v1/palettes/delete/1")
          .end((err, response) => {
            response.should.have.status(204);

            chai
              .request(server)
              .get("/api/v1/palettes/1")
              .end((err, response) => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a("array");
                response.body.length.should.equal(2);
                response.body[0].should.have.property("id");
                response.body[0].should.have.property("palette_name");
                response.body[0].should.have.property("color_1");
                response.body[0].should.have.property("color_2");
                response.body[0].should.have.property("color_3");
                response.body[0].should.have.property("color_4");
                response.body[0].should.have.property("color_5");
                response.body[0].should.have.property("created_at");
                response.body[0].should.have.property("updated_at");

                done();
              });
          });
      });
    });
  });

  describe("DELETE /api/v1/projects/:id", () => {
    it("should delete a project from the database", done => {
      chai.request(server).get("/api/v1/projects").end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a("array");
        response.body.length.should.equal(3);
        response.body[0].should.have.property("id");
        response.body[0].should.have.property("created_at");
        response.body[0].should.have.property("updated_at");

        chai
          .request(server)
          .delete("/api/v1/projects/1")
          .end((err, response) => {
            response.should.have.status(204);

            chai
              .request(server)
              .get("/api/v1/projects")
              .end((err, response) => {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a("array");
                response.body.length.should.equal(2);
                response.body[0].should.have.property("id");
                response.body[0].should.have.property("project_name");
                response.body[0].should.have.property("created_at");
                response.body[0].should.have.property("updated_at");

                done();
              });
          });
      });
    });
  });
});
