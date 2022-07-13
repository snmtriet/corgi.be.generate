require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");

const s3Client = new AWS.S3({
  endpoint: process.env.END_POINT,
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const uploadPromise = async (entriesImage, outDir, outputDirName, index) => {
  return new Promise((resolve, reject) => {
    s3Client.putObject(
      {
        Bucket: process.env.BUCKET,
        Key: `${outputDirName}/${index + 1}`,
        Body: fs.createReadStream(`${outDir}/${entriesImage[index]}`),
        ACL: "public-read",
        ContentType: "image/png",
      },
      async (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(true);
      }
    );
  });
};

module.exports = { uploadPromise, s3Client };
