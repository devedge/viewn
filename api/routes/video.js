const express = require("express");
const router = express.Router();

// read all models & connect to database
const models = require("../models");

// POST /video
router.post("/", (req, res, next) => {
  let currentdate = new Date();

  if (req.body.created_at) {
    currentdate = new Date(req.body.created_at);
  }

  const newVideo = {
    videoid: req.body.videoid,
    title: req.body.title,
    location: req.body.location,
    thumbnail: req.body.thumbnail,
    filetype: req.body.filetype,
    sha256sum: req.body.sha256sum,
    tags: req.body.tags,
    length: req.body.length,
    quality: req.body.quality,
    uploadedAt: currentdate,
  };

  models.video
    .create(newVideo)
    .then(() => {
      res.status(201).json({
        status: "success",
        result: newVideo,
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

// GET /video
router.get("/:videoID", (req, res, next) => {
  // allow requests to specify what fields they want back
  let attributeQuery = { where: { videoid: req.params.videoID } };

  if (req.query.fields) {
    attributeQuery["attributes"] = req.query.fields.split(",");
  }

  models.video
    .findOne(attributeQuery)
    .then((video) => {
      res.status(200).json({
        status: "success",
        result: video,
      });
      // TODO: add condition for null results?
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

// PATCH /video
router.patch("/:videoID", (req, res, next) => {
  // for each of the fields, set its name in updateFields and then its value.
  let updateFields = {};

  for (const item of req.body) {
    // if the field "update_tags" exists, append the items to "tags"
    if (item.field === "update_tags") {
      updateFields["tags"] = models.sequelize.fn(
        "array_cat",
        models.sequelize.col("tags"),
        item.value
      );
    } else if (item.field === "videoid") {
      // prevent the primary key from being changed
      // TODO: security issue? will this fail faster than if another invalid field was passed?
      console.log("ERROR: TRIED EDITING PRIMARY KEY");
      console.log("User data: " + JSON.stringify(updateFields));
      res.status(500).json({
        status: "error",
        error: "Invalid field/data",
      });
      return;
    } else {
      updateFields[item.field] = item.value;
    }
  }

  models.video
    .update(updateFields, {
      returning: true,
      where: { videoid: req.params.videoID },
    })
    .then(([rowsUpdated, [video]]) => {
      if (rowsUpdated == 0) {
        res.status(404).json({
          status: "error",
          error: "Video does not exist",
        });
      } else {
        res.status(200).json({
          status: "success",
          result: video,
        });
      }
    })
    .catch((err) => {
      console.log("User data: " + JSON.stringify(updateFields));
      console.log(err);
      res.status(500).json({
        status: "error",
        error: "Invalid field/data",
      });
      // TODO: return non-descriptive error
    });
});

// DELETE /video
router.delete("/:videoID", (req, res, next) => {
  models.video
    .destroy({ where: { videoid: req.params.videoID } })
    .then((video) => {
      res.status(200).json({
        status: "success",
        result: video,
        // TODO: return video data, this value is '1'
      });
      // TODO: add condition for null results?
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
