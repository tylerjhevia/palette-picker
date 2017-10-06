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
  it("should return the homepage", done => {
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
    database.migrate.rollback;
  });
  before(done => {
    database.migrate
      .latest()
      //   .then(() => {
      //     database.seed.run();
      //   })
      .then(() => done())
      .catch(error => console.log("error", error));
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
        console.log(response.body);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a("array");
        response.body.length.should.equal(3);
        response.body[0].should.have.property("project_name");
        response.body[0].project_name.should.equal("Important");
        response.body[0].should.have.property("id");
        response.body[0].id.should.be.a("number");
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
      chai.request(server).get("/api/v1/palettes/10").end((err, response) => {
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
        response.body[0].id.should.equal(28);
        response.body[0].should.have.property("project_id");
        response.body[0].project_id.should.equal(10);
        response.body[0].should.have.property("created_at");
        response.body[0].should.have.property("updated_at");
        done();
      });
    });
  });

  //   describe("POST /api/v1/projects", () => {
  //     it("should create a new project", done => {
  //       chai
  //         .request(server)
  //         .post("/api/v1/projects") // Notice the change in the verb
  //         .send({
  //           // Here is the information sent in the body or the request
  //           project_name: "Donuts"
  //         })
  //         .end((err, response) => {
  //           response.should.have.status(201); // Different status here
  //           console.log(response.body);
  //           response.body.should.be.a("object");
  //           response.body.should.have.property("lastname");
  //           response.body.lastname.should.equal("Knuth");
  //           response.body.should.have.property("program");
  //           response.body.program.should.equal("FE");
  //           response.body.should.have.property("enrolled");
  //           response.body.enrolled.should.equal(true);
  //           chai
  //             .request(server) // Can also test that it is actually in the database
  //             .get("/api/v1/students")
  //             .end((err, response) => {
  //               response.should.have.status(200);
  //               response.should.be.json;
  //               response.body.should.be.a("array");
  //               response.body.length.should.equal(4);
  //               response.body[3].should.have.property("lastname");
  //               response.body[3].lastname.should.equal("Knuth");
  //               response.body[3].should.have.property("program");
  //               response.body[3].program.should.equal("FE");
  //               response.body[3].should.have.property("enrolled");
  //               response.body[3].enrolled.should.equal(true);
  //               done();
  //             });
  //         });
  //     });
  //   });
});
