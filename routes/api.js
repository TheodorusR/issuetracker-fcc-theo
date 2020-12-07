'use strict';
const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  project: String,
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: {type: String, default: ""},
  status_text: {type: String, default: ""},
  created_on: {type: Date, default: new Date().toISOString()},
  updated_on: {type: Date, default: new Date().toISOString()},
  open: {type: Boolean, default: true}
})

const Issue = mongoose.model('Issue', IssueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      req.query.project = req.params.project;
      try {
        let getIssue = await Issue.find(req.query);
        res.json(getIssue);
      } catch (err) {
        res.json({
          confirmation: "search failed",
          message: err.message
        })
      }
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      try {
        let newIssue = await Issue.create({
          project: project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text
        });
        //Change the properties sent later!!
        res.json(newIssue);
      } catch (err) {
        res.json({
          error: 'required field(s) missing' 
        });
      }
    })
    
    .put(async function (req, res){
      let id = req.body._id;
      delete req.body["_id"];

      if (!id) {
        res.json({
          error: 'missing _id'
        });
        return;
      } else if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text && !req.body.open) {
        res.json({
          error: 'no update field(s) sent', 
          '_id': id
        });
        return;
      }

      //if "open" has value, convert it to boolean
      if (req.body.open) {
        req.body.open = (req.body.open == 'true')
      }

      let project = req.params.project;
      req.body.updated_on = new Date().toISOString();

      try {
        let updatedIssue = await Issue.findOneAndUpdate({project: project, _id: id}, req.body, {new:true});

        //prevent successful response for nonexistent issue
        if (updatedIssue) {
          res.json({
            result: 'successfully updated', 
            '_id': id
          });
        } else {
          throw Error();
        }
      } catch (err) {
        res.json({
          error: 'could not update', 
          '_id': id
        });
      }
    })
    
    .delete(async function (req, res){
      
      let id = req.body._id;
      delete req.body["_id"];

      if (!id) {
        res.json({
          error: 'missing _id'
        });
        return;
      }

      let project = req.params.project;

      try {
        let deletedIssue = await Issue.findOneAndRemove({project: project, _id: id});

        //prevent successful response for nonexistent issue
        if (deletedIssue) {
          res.json({
            result: 'successfully deleted', 
            '_id': id
          });
        } else {
          throw Error();
        }
      } catch (err) {
        res.json({
          error: 'could not delete', 
          '_id': id
        });
      }
    });
    
};
