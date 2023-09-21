const express = require("express");
const router = express.Router();
const multer = require("multer");
const authentication = require("../middlewares/authentication");

const {
  createPost,
  getPost,
  createComment,
  likePost,
  getSinglePost,
  updatePost,
  deletePost,
} = require("../controllers/post");
const ownerValidation = require("../middlewares/ownerValidation");

// multer for image upload on post
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads/postImages");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    // cb(null, `${fileName}-${Date.now()}.${extension}`);
    cb(null, `${Math.floor(Math.random() * 100000)}${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// routes
router.post(
  "/create",
  authentication,
  uploadOptions.array("images", 10),
  createPost
);

router.get("/", getPost);

router.post("/comment/:id", authentication, createComment);

router.post("/like/:id", authentication, likePost);

router.get("/:id", authentication, getSinglePost);

router.patch("/update/:id", authentication, ownerValidation, updatePost);

router.delete("/delete/:id", authentication, ownerValidation, deletePost);

module.exports = router;
