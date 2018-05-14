const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();
//Post model
const Post = require("../../modules/Posts");
//Profile model
const Profile = require("../../modules/Profile");
//Validation Post
const validatePostInput = require("../../validation/post");

// @route GET api/posts/tests
// @desc test users route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Posts Works"
  })
);

/**
 * @route GET api/posts
 * @desc Get post
 * @access Pblic
 */
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostsfound: "NO POSTS FOUND WHIT THAT ID" })
    );
});

/**
 * @route GET api/posts
 * @desc Get post by id
 * @access Pblic
 */
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "NO POST FOUND WHIT THAT ID" })
    );
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      //if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

/**
 * @route DELETE api/posts/:id
 * @desc Delet post
 * @access Private
 */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check for post owner
          if (post.user.toString() != req.user.id) {
            return res
              .status(401)
              .json({ notouthorized: "user not authorized" });
          }
          //Delete
          post.remove().the(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

/**
 * @route post api/posts/like/:id
 * @desc Like post
 * @access Private
 */
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alredyliked: "user already liked this post" });
          }
          // add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

/**
 * @route post api/posts/unlike/:id
 * @desc unlike post
 * @access Private
 */
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ alredyliked: "You rave not yet liked this post" });
          }
          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          // Splice out of array
          post.likes.splice(removeIndex, 1);
          //save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

module.exports = router;
