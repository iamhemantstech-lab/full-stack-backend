import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
// const crypto = require("crypto");
// import crypto from "crypto";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public");
//   },
//   filename: function (req, file, cb) {
//     crypto.randomBytes(16, function (err, raw) {
//       if (err) return cb(err);
//       cb(null, file.fieldname + "-" + raw.toString("hex"));
//     });
//   },
// });

// // const upload = multer({ storage: storage });
// export const upload = multer({
//   storage,
// });
