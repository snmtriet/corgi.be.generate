const mapFolder = require("map-folder");

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

const createConfig = (destination) => {
  const traits = mapFolderInput(destination);
  const a = getElementsTrait(traits, "accessory", 800, 800);
  console.log(a);

  const races = {
    Nft: {
      // Must bee the same as value on line 12 | ALL CAPITALIZATIONS MATTER
      name: "Nft", // Make same as above | This is just a skeleton, more characters/skins can be added later
      layers: "a",
    },
  };
};

const getElementsTrait = (traits, type, width, height) => {
  const traitsWithId = traits.map((trait, i) => {
    return {
      id: i,
      name: trait.base.replaceAll("_", " "),
      path: trait.path,
      type: trait.type,
    };
  });

  const traitFiltered = traitsWithId.filter((trait) => {
    return trait.type === type;
  });

  const traitConfig = {
    name: type,
    elements: [...traitFiltered],
    position: { x: 0, y: 0 },
    size: { width: width, height: height },
  };
  return traitConfig;
};

module.exports = { traitList, mapFolderInput, createConfig, getElementsTrait };
