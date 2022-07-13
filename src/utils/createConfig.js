const mapFolder = require("map-folder");

// --------------------------

const width = 1080; // Change to the resolution you want 1000 x 1000 is common
const height = 1080;
const startEditionFrom = 1; //
const endEditionAt = 500; // endEditionAt and editionSize MUST be the SAME // start at 30 for testing purposes
const editionSize = 500; // this will print 10 copies
const raceWeights = [
  {
    value: "Nft", // Change to whatever you want
    from: 1,
    to: editionSize,
  },
];

// --------------------------

const traitList = [
  "accessory",
  "background",
  "face",
  "left_eye",
  "mouth",
  "right_eye",
];

const mapFolderInput = (destination) => {
  const currentFolder = mapFolder(destination, {});
  const entriesFolder = currentFolder.entries; // ex: input_1655597483200

  // sub folder must be have a name is "images"
  const subFolder = entriesFolder.images.entries; // ex: input_1655597483200/images
  const traits = traitList.map((trait, i) => {
    const traitObj = subFolder[traitList[i]].entries; // return array trait
    const traitImages = Object.keys(traitObj).map((name) => {
      return { ...traitObj[name], type: traitList[i] };
    });
    return traitImages;
  });
  return traits.flat();
};

const createConfig = (destination, width, height) => {
  const traits = mapFolderInput(destination);

  const races = {
    Nft: {
      // Must bee the same as value on line 12 | ALL CAPITALIZATIONS MATTER
      name: "Nft", // Make same as above | This is just a skeleton, more characters/skins can be added later
      layers: [
        getElementsTrait(traits, "background", width, height),
        getElementsTrait(traits, "face", width, height), // body
        getElementsTrait(traits, "mouth", width, height), // mouth
        getElementsTrait(traits, "left_eye", width, height), // shirt
        getElementsTrait(traits, "right_eye", width, height), //eyes
        getElementsTrait(traits, "accessory", width, height), // hat
      ],
    },
  };
  return races;
};

const getElementsTrait = (traits, type, width, height) => {
  const cloneTraits = [...traits];

  const traitFiltered = cloneTraits.filter((trait) => {
    return trait.type === type;
  });

  let weightRate;
  switch (type) {
    case "background":
      weightRate = Math.floor((Math.random() * 100) / traitFiltered.length) + 8;
      break;
    case "face":
      weightRate = Math.floor((Math.random() * 100) / traitFiltered.length) + 7;
      break;
    case "accessory":
      weightRate = Math.floor((Math.random() * 100) / traitFiltered.length) + 5;
      break;
    case "mouth":
      weightRate = Math.floor((Math.random() * 100) / traitFiltered.length) + 4;
      break;
    case "right_eye":
      weightRate = Math.floor((Math.random() * 100) / traitFiltered.length) + 6;
      break;
    case "left_eye":
      weightRate = Math.floor((Math.random() * 100) / traitFiltered.length) + 6;
      break;
    default:
      console.log("not found");
  }

  console.log(`weight rate of ${type} is `, weightRate);

  traitFiltered.forEach((trait, i) => {
    if (trait.type === type) {
      traitFiltered[i] = {
        id: i,
        name: trait.base.replaceAll("_", " "),
        path: trait.path,
        type: trait.type,
        weight: i > 0 ? traitFiltered[i - 1].weight - weightRate : 100,
      };
    }
  });

  const traitConfig = {
    name: type,
    elements: [...traitFiltered],
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  };
  return traitConfig;
};

module.exports = {
  width,
  height,
  startEditionFrom,
  endEditionAt,
  raceWeights,
  mapFolderInput,
  createConfig,
  getElementsTrait,
};
