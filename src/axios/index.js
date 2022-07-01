const axios = require("axios");
var FormData = require("form-data");
const fs = require("fs");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNDcyMGVkYS05NjE0LTQ5YzgtOGQ5MS1iZThhNTFkYjZjY2UiLCJlbWFpbCI6ImJpbmRzdTYzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4YjY1ZTJhNjE0ZjdlMWVhNzZlNiIsInNjb3BlZEtleVNlY3JldCI6ImYwYmE5YTY5ZDY4MWY3Mjg5ZGVkYTI0N2JjNjgxY2QzNTNlMjk0NDg1MmEwMGU0NDg5MDExMWRlZmFlZjg1ZjUiLCJpYXQiOjE2NTY1ODY3MTh9.skISqPN7uz-idCGCbS4K1Ke4DYbVMosF2qWO_KA-zp0";
const GATEWAY_URL =
  "https://gateway.pinata.cloud/ipfs" || "https://ipfs.io/ipfs/";
const pinata = axios.create({
  baseURL: "https://api.pinata.cloud",
  //   timeout: 1000,
  headers: {
    Authorization: `Bearer ${token}`,
    pinata_api_key: "8b65e2a614f7e1ea76e6",
    pinata_secret_api_key:
      "f0ba9a69d681f7289deda247bc681cd353e2944852a00e44890111defaef85f5",
  },
});

pinata.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

pinata.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const pinFileToIPFS = async (entriesImage, outDir, outputDirName) => {
  const dataFile = new FormData();

  const urlFile = `/pinning/pinFileToIPFS`;

  // pin multiple file type image same folder to pinata
  for (const name in entriesImage) {
    const image = fs.createReadStream(`${outDir}/${entriesImage[name]}`);
    dataFile.append("file", image, {
      filename: entriesImage[name],
      filepath: `${outputDirName}/${entriesImage[name]}`,
      contentType: "image/png",
    });
  }

  try {
    const res = await pinata.post(urlFile, dataFile, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${dataFile._boundary}`,
      },
    });

    const uriData = res.data.IpfsHash;

    return `${GATEWAY_URL}/${uriData}`;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { GATEWAY_URL, pinata, pinFileToIPFS };
