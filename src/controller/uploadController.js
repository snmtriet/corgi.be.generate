const fs = require("fs");
const path = require("path");
const extract = require("extract-zip");
const formidable = require("formidable");
const AdmZip = require("adm-zip");
const { v4: uuidv4 } = require("uuid");

const extractDir = path.join(__dirname, "../../generate/inputs/");

const { startCreating } = require("../utils/generate");
const { createConfig, width, height } = require("../utils/createConfig");
const mapFolder = require("map-folder");

const basePath = process.cwd();

if (!fs.existsSync(extractDir)) {
  fs.mkdirSync(extractDir);
}

exports.download = async (req, res) => {
  try {
    const outputName = req.query.dir;
    const outputPath = `${basePath}/generate/download/${outputName}`;
    if (fs.existsSync(extractDir)) {
      res.download(outputPath);
    } else {
      res.status(404).json({
        message: "file maybe doesn't exist",
      });
    }
  } catch (error) {
    console.log("🍕 ~ error", error);
  }
};

exports.uploadFile = async (req, res, next) => {
  const form = new formidable.IncomingForm();
  // form.maxFileSize = 1000 * 1024 * 1024;
  form.keepExtensions = true;
  form.multiples = false;

  form.parse(req, function (err, fields, files) {
    if (err) return res.status(500).json({ error: err });

    if (Object.keys(files).length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const filePath = files.file.filepath;
    const fileExt = path.extname(files.file.originalFilename || "input.zip");

    if (fileExt !== ".zip") {
      return res.status(400).json({ message: "Unsupported file type" });
    } else {
      const destDir = `${path.join(extractDir, "input")}_${uuidv4()}`;
      const outputName = `output_${uuidv4()}`;
      extract(filePath, { dir: destDir }, (err) => {
        if (!err) {
          if (true) fs.unlinkSync(file);
          // nestedExtract(destDir, extractZip);
        } else {
          console.error(err);
        }
      }).then(() => {
        const resultRace = createConfig(destDir, width, height);
        const outDir = `${basePath}/generate/outputs/output_${uuidv4()}`;

        startCreating(resultRace, outDir)
          .then((_d) => {
            fs.rmSync(destDir, { recursive: true });
            const outputData = mapFolder(outDir, {});
            const entriesOutput = outputData.entries;
            var zip = new AdmZip();
            Object.keys(entriesOutput).map((file) => {
              if (entriesOutput[file].ext === "png") {
                zip.addFile(
                  `output/images/${entriesOutput[file].name}`,
                  fs.readFileSync(entriesOutput[file].path)
                );
              } else {
                zip.addFile(
                  `output/metadata/${entriesOutput[file].name}`,
                  fs.readFileSync(entriesOutput[file].path)
                );
              }
            });
            zip.writeZip(`${basePath}/generate/download/${outputName}.zip`);
          })
          .then((_d) => {
            fs.rmSync(outDir, { recursive: true });
          })
          .then((_d) => {
            res.status(200).json({ outputDir: `${outputName}.zip` });
            setTimeout(() => {
              fs.rmSync(`${basePath}/generate/download/${outputName}.zip`, {
                recursive: true,
              });
            }, 3 * 60 * 1000);
          });
      });
    }
  });
};
