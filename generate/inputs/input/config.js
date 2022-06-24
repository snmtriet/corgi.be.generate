const width = 750; // Change to the resolution you want 1000 x 1000 is common
const height = 1200;
const path = require("path");
const dir = path.join(__dirname, "../input/");
const description =
  "This NFT is part of The Bee Collaborative Collection | Save the Bees with NFTs!";
const baseImageUri =
  "https://gateway.ipfs.io/ipns/k51qzi5uqu5dhl0enp0dupzorbyhsmsdj1aewjbghr0se5kb1w1s65dof038g5";
const startEditionFrom = 1; //
const endEditionAt = 5; // endEditionAt and edtionSize MUST be the SAME // start at 10 for testing purposes
const editionSize = 5; // this will print 10 copies
const raceWeights = [
  {
    value: "Nft", // Change to whatever you want
    from: 1,
    to: editionSize,
  },
];

const races = {
  Nft: {
    // Must bee the same as value on line 12 | ALL CAPITALIZATIONS MATTER
    name: "Nft", // Make same as above | This is just a skeleton, more characters/skins can be added later
    layers: [
      {
        name: "accessory",
        elements: [
          {
            id: 0,
            name: "Horns aqua",
            path: `${dir}/accessory/horns_aqua.png`, // 1-background = folder name/image name
            weight: 100, // 16%   Every gap in numbers is = to % of rarity chance
          },
          {
            id: 1,
            name: "Horns pink",
            path: `${dir}/accessory/horns_blue.png`, // 1-background = folder name/image name
            weight: 84, // 16%
          },
          {
            id: 2,
            name: "Horns pink",
            path: `${dir}/accessory/horns_green.png`, // 1-background = folder name/image name
            weight: 68, // 17%
          },
          {
            id: 3,
            name: "Horns pink",
            path: `${dir}/accessory/horns_orange.png`, // 1-background = folder name/image name
            weight: 51, //17%
          },
          {
            id: 4,
            name: "Horns pink",
            path: `${dir}/accessory/horns_pink.png`, // 1-background = folder name/image name
            weight: 34, // 17%
          },
          {
            id: 5,
            name: "Horns purple",
            path: `${dir}/accessory/horns_purple.png`, // 1-background = folder name/image name
            weight: 17, // 17%
          },
        ],
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
      },
      {
        name: "background",
        elements: [
          {
            id: 0,
            name: "Black",
            path: `${dir}/background/black.jpg`, // 1-background = folder name/image name
            weight: 100, // 16%   Every gap in numbers is = to % of rarity chance
          },
        ],
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
      },
      {
        name: "face",
        elements: [
          {
            id: 0,
            name: "Round aqua",
            path: `${dir}/face/round_aqua.png`,
            weight: 100, // 10%
          },
          {
            id: 1,
            name: "Round red",
            path: `${dir}/face/round_red.png`,
            weight: 90, // 15%
          },
          {
            id: 2,
            name: "Round aqua",
            path: `${dir}/face/round_orange.png`,
            weight: 75, // 10%
          },
          {
            id: 3,
            name: "Round red",
            path: `${dir}/face/round_purple.png`,
            weight: 65, // 15%
          },
        ],
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
      },
      {
        name: "left eye",
        elements: [
          {
            id: 0,
            name: "swirl aqua",
            path: `${dir}/left_eye/swirl_aqua.png`,
            weight: 100, // 30%
          },
          {
            id: 1,
            name: "swirl red",
            path: `${dir}/left_eye/swirl_red.png`,
            weight: 70, // 15%
          },
          {
            id: 2,
            name: "swirl aqua",
            path: `${dir}/left_eye/swirl_blue.png`,
            weight: 65, // 30%
          },
          {
            id: 3,
            name: "swirl red",
            path: `${dir}/left_eye/swirl_orange.png`,
            weight: 35, // 15%
          },
        ],
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
      },
      {
        name: "mouth",
        elements: [
          {
            id: 0,
            name: "grin aqua",
            path: `${dir}/mouth/grin_aqua.png`,
            weight: 100, // 31%
          },
          {
            id: 1,
            name: "grin red",
            path: `${dir}/mouth/grin_red.png`,
            weight: 69, // 1%
          },
          {
            id: 2,
            name: "grin aqua",
            path: `${dir}/mouth/grin_orange.png`,
            weight: 68, // 31%
          },
          {
            id: 3,
            name: "grin red",
            path: `${dir}/mouth/grin_yellow.png`,
            weight: 37, // 1%
          },
        ],
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
      },
      {
        name: "right eye",
        elements: [
          {
            id: 0,
            name: "None",
            path: `${dir}/right_eye/swirl_aqua.png`,
            weight: 100, // 20%
          },
          {
            id: 1,
            name: "Bloody Swipe",
            path: `${dir}/right_eye/swirl_red.png`,
            weight: 80, // 15%
          },
          {
            id: 2,
            name: "None",
            path: `${dir}/right_eye/swirl_green.png`,
            weight: 65, // 20%
          },
          {
            id: 3,
            name: "Bloody Swipe",
            path: `${dir}/right_eye/swirl_orange.png`,
            weight: 45, // 15%
          },
        ],
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
      },
    ],
  },
};

module.exports = {
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  endEditionAt,
  races,
  raceWeights,
};
