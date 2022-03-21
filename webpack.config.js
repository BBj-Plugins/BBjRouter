const path = require('path');

module.exports = {
  entry: "./client/index.js",
  output: {
    filename: "bbj-router.min.js",
    path: path.resolve((__dirname, "dist"))
  }
}