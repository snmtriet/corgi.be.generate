const fs = require("fs");
const path = require("path");
const extract = require("extract-zip");
const formidable = require("formidable");

const extractDir = path.join(__dirname, "../../generate/inputs/");
const outputDir = path.join(__dirname, "../../generate/outputs/output/");

const startCreating = require("../../generate/index");
const { mapFolderInput, createConfig } = require("../utils");

if (!fs.existsSync(extractDir)) {
  fs.mkdirSync(extractDir);
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

exports.getHello = async (req, res) => {
  res.status(200).json({
    message: "Hello",
  });
};

exports.uploadFile = (req, res, next) => {
  const form = new formidable.IncomingForm();
  // form.maxFileSize = 1000 * 1024 * 1024;
  form.keepExtensions = true;
  form.multiples = false;
  // form.uploadDir = uploadDir;

  form.parse(req, function (err, fields, files) {
    if (err) return res.status(500).json({ error: err });

    if (Object.keys(files).length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const filePath = files.file.filepath;
    const fileExt = path.extname(files.file.originalFilename);
    // const fileName = path.basename(files.file.originalFilename, fileExt);

    if (fileExt !== ".zip") {
      return res.status(400).json({ message: "Unsupported file type" });
    } else {
      res.status(200).json({ uploaded: true });
    }

    const destDir = `${path.join(extractDir, "input")}_${new Date().getTime()}`;
    extractZip(filePath, destDir, false);
    startCreating();
  });
};

const extractZip = (file, destination, deleteSource) => {
  extract(file, { dir: destination }, (err) => {
    if (!err) {
      if (deleteSource) fs.unlinkSync(file);
      nestedExtract(destination, extractZip);
    } else {
      console.error(err);
    }
  }).then(() => {
    createConfig(destination);
  });
};

const nestedExtract = (dir, zipExtractor) => {
  fs.readdirSync(dir).forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isFile()) {
      if (path.extname(file) === ".zip") {
        // deleteSource = true to avoid infinite loops caused by extracting same file
        zipExtractor(path.join(dir, file), dir, true);
      }
    } else {
      nestedExtract(path.join(dir, file), zipExtractor);
    }
  });
};
