const express = require("express");
const router = express.Router();

// read all models & connect to database
const models = require("../models");

// GET /search
router.get("/", (req, res, next) => {
  // build up an array of queries that will be ANDed & executed
  let compoundQuery = [];

  // construct sequelize query for the title
  if (req.query.q) {
    compoundQuery.push({
      title: { [models.Sequelize.Op.iLike]: "%" + req.query.q + "%" },
    });
  }

  // construct sequelize query to search for sha256sum
  if (req.query.sha256sum) {
    compoundQuery.push({ sha256sum: req.query.sha256sum });
  }

  // Search tags and adjust query with the "match" option. The only valid options
  // for "match" are "any" (match any tag) & "all" (must match all tags).
  //
  // TODO: case-insensitive search tags fields
  // Not exactly possible, unless following the guide here?: https://stackoverflow.com/a/55484447
  //  Instead, consider doing something more relational, like putting the tags in another table?
  //  Additional question: https://stackoverflow.com/q/7222106
  if (req.query.match) {
    if (req.query.match != "any" && req.query.match != "all") {
      req.query.match = "any";
    }
  } else {
    req.query.match = "any";
  }

  // Build sequelize query for tags
  if (req.query.tags) {
    switch (req.query.match) {
      case "any":
        compoundQuery.push({
          tags: {
            [models.Sequelize.Op.overlap]: req.query.tags.split(","),
          },
        });
        break;

      case "all":
        compoundQuery.push({
          tags: {
            [models.Sequelize.Op.contains]: req.query.tags.split(","),
          },
        });
        break;
    }
  }

  // Allow requests to specify what fields to return
  let attributeQuery = { where: models.sequelize.and(compoundQuery) };

  if (req.query.fields) {
    attributeQuery["attributes"] = req.query.fields.split(",");
  }

  // Execute sequelize query and return JSON response
  models.video
    .findAll(attributeQuery)
    .then((videos) => {
      res.status(200).json({
        status: "success",
        result: videos,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: "error",
        error: err,
      });
      // TODO: return non-descriptive error
    });
});

module.exports = router;
