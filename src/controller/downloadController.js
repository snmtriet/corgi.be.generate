const path = require("path");

exports.getFileExample = async (req, res) => {
  try {
    const fileExample = path.join(
      __dirname,
      "../../generate/example/input_example.zip"
    );

    res.download(fileExample);
  } catch (error) {
    res.status(404).json({
      message: "not found",
    });
  }
};
