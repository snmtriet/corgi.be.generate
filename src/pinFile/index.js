const { uploadPromise, s3Client } = require("../utils/uploadPromise");
require("dotenv").config();

const pinFileToDo = async (entriesImage, outDir, outputDirName) => {
  try {
    await Promise.all([
      ...entriesImage.map((name, index) => {
        return uploadPromise(entriesImage, outDir, outputDirName, index);
      }),
    ]);
    let uri = s3Client.getSignedUrl("getObject", {
      Bucket: process.env.BUCKET,
      Key: `${outputDirName}/${entriesImage[0]}`,
    });
    return uri.slice(0, uri.indexOf("/1.png"));
  } catch (error) {
    console.log("🍕 ~ error", error);
  }
};

module.exports = { pinFileToDo };
