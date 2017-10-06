const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);

describe("Client Routes", () => {
  it("should return the homepage", done => {
    chai.request(server).get("/").end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });
});

describe("API Routes", () => {
  before(done => {
    // Run migrations and seeds for test database
    done();
  });

  beforeEach(done => {
    // Would normally run run your seed(s), which includes clearing all records
    // from each of the tables
    // server.locals.students = students;
    done();
  });

  describe("GET /api/v1/projects", () => {
    it("should return all saved projects", done => {
      chai.request(server).get("/api/v1/projects").end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a("array");
        // response.body.length.should.equal(1);
        response.body[0].should.have.property("project_name");
        // response.body[0].lastname.should.equal("Turing");
        // response.body[0].should.have.property("program");
        // response.body[0].program.should.equal("FE");
        // response.body[0].should.have.property("enrolled");
        // response.body[0].enrolled.should.equal(true);
        done();
      });
    });
  });
});
