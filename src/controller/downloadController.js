const path = require("path");

exports.getFileExample = async (req, res) => {
  const fileExample = path.join(
    __dirname,
    "../../generate/example/input_example.zip"
  );

  res.download(fileExample);
};
