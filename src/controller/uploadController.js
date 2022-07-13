const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { v4: uuidv4 } = require("uuid");
const extract = require("extract-zip");
const mapFolder = require("map-folder");
const formidable = require("formidable");

const extractDir = path.join(__dirname, "../../generate/inputs/");

const { startCreating } = require("../utils/generate");
const { createConfig, width, height } = require("../utils/createConfig");
const { pinFileToDo } = require("../pinFile");

const basePath = process.cwd();

if (!fs.existsSync(extractDir)) {
  fs.mkdirSync(extractDir);
}

exports.download = async (req, res) => {
  try {
    const outputName = req.query.dir;
    const outputPath = `${basePath}/generate/download/${outputName}`;
    if (fs.existsSync(extractDir)) {
      res.download(outputPath, (err) => {
        console.log(err);
        setTimeout(() => {
          fs.rmSync(outputPath, {
            recursive: true,
          });
        }, 1 * 1 * 60 * 1000);
      });
    } else {
      res.status(404).json({
        message: "Some thing went wrong!",
      });
    }
  } catch (error) {
    console.log("🍕 ~ error", error);
  }
};

exports.uploadFile = async (req, res, next) => {
  const contractName = req.query.contractName;
  const collectionName = req.query.collectionName;
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
        const outputDirName = `output_${uuidv4()}`;
        const outDir = `${basePath}/generate/outputs/${outputDirName}`;

        startCreating(resultRace, outDir, contractName, collectionName)
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
            if (!fs.existsSync(`${basePath}/generate/download/`)) {
              fs.mkdirSync(`${basePath}/generate/download/`);
              zip.writeZip(`${basePath}/generate/download/${outputName}.zip`);
            } else {
              zip.writeZip(`${basePath}/generate/download/${outputName}.zip`);
            }
            return entriesOutput;
          })
          .then(async (entriesOutput) => {
            const entriesImage = Object.keys(entriesOutput).filter((file) => {
              return entriesOutput[file].ext === "png";
            });

            const URI = await pinFileToDo(entriesImage, outDir, outputDirName);
            fs.rmSync(outDir, { recursive: true });
            res.status(200).json({
              outputDir: `${outputName}.zip`,
              dataURI: {
                URI: URI,
                outputDirName,
                total: entriesImage.length,
              },
            });
            setTimeout(() => {
              if (
                fs.existsSync(`${basePath}/generate/download/${outputName}.zip`)
              ) {
                fs.rmSync(`${basePath}/generate/download/${outputName}.zip`, {
                  recursive: true,
                });
              }
              if (fs.existsSync(outDir)) {
                fs.rmSync(outDir, {
                  recursive: true,
                });
              }
            }, 12 * 60 * 60 * 1000);
          });
      });
    }
  });
};
