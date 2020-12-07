const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Creating issue', function() {
    test('Create an issue with every field', function(done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          'issue_title' : "Testing Issue",
          'issue_text' : "with mocha chai",
          'created_by' : "Neo Calystro",
          'assigned_to' : "Ryan Reynolds",
          'status_text' : "in process"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, "Testing Issue");
          assert.equal(res.body.issue_text, "with mocha chai");
          assert.equal(res.body.created_by, "Neo Calystro");
          assert.equal(res.body.assigned_to, "Ryan Reynolds");
          assert.equal(res.body.status_text, "in process");
          done();
        })
    });
    test('Create an issue with only required fields', function(done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          'issue_title' : "Testing Issue",
          'issue_text' : "with mocha chai",
          'created_by' : "Neo Calystro"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.issue_title, "Testing Issue");
          assert.equal(res.body.issue_text, "with mocha chai");
          assert.equal(res.body.created_by, "Neo Calystro");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        })
    });
    test('Create an issue with missing required fields', function(done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          'issue_title' : "Testing Issue",
          'issue_text' : "with mocha chai"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        })
    });
  });
  suite('Viewing issue', function() {
    test('View issues on a project', function(done) {
      chai
        .request(server)
        .get("/api/issues/apitest")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          done();
        })
    });
    test('View issues on a project with one filter', function(done) {
      chai
        .request(server)
        .get("/api/issues/apitest?open=false")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          done();
        })
    });
    test('View issues on a project with multiple filters', function(done) {
      chai
        .request(server)
        .get("/api/issues/apitest?open=false&issue_title=Testing Issue")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body);
          done();
        })
    });
  });
  suite('Updating issue', function() {
    test('Update one field on an issue', function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          '_id': "5fce191cb711c901368225df",
          'issue_title': "Use This Title Instead"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, "5fce191cb711c901368225df");
          done();
        })
    });
    test('Update multiple fields on an issue', function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          '_id': "5fce191cb711c901368225df",
          'issue_title': "A Brand New Title",
          'issue_text': "A brand new text"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id, "5fce191cb711c901368225df");
          done();
        })
    });
    test('Update an issue with missing _id', function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          'issue_title': "A Brand New Title",
          'issue_text': "A brand new text"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
          done();
        })
    });
    test('Update an issue with no fields to update', function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          '_id': "5fce191cb711c901368225df"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id, "5fce191cb711c901368225df");
          done();
        })
    });
    test('Update an issue with an invalid _id', function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          '_id': "5fce191cb7",
          'issue_title': "A Brand New Title",
          'issue_text': "A brand new text"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id, "5fce191cb7");
          done();
        })
    });
  });
  suite('Deleting issue', function() {
    test('Delete an issue', function(done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          'issue_title' : "Testing Issue",
          'issue_text' : "with mocha chai",
          'created_by' : "Neo Calystro"
        })
        .end((err, res) => {
          id = res.body._id
          chai
          .request(server)
          .delete("/api/issues/apitest")
          .send({
            '_id': id
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.result, 'successfully deleted');
            assert.equal(res.body._id, id);
            done();
          })
        })
    });
    test('Delete an issue with an invalid _id', function(done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          '_id': "an invalid id"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id, "an invalid id");
          done();
        })
    });
    test('Delete an issue with missing _id', function(done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.error, 'missing _id');
          done();
        })
    });
  });
});
