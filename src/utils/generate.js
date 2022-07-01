const fs = require("fs");

const { createCanvas, loadImage } = require("canvas");
const {
  width,
  height,
  startEditionFrom,
  endEditionAt,
  raceWeights,
} = require("./createConfig");

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

var metadataList = [];
var attributesList = [];
var dnaList = [];

const saveImage = (_editionCount, outputFolder) => {
  fs.writeFileSync(
    `${outputFolder}/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const addMetadata = (_dna, _edition, _contractName) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: _dna.join(""),
    name: `${_contractName} #${_edition}`,
    description: `${_contractName} #${_edition} - Generated and deployed on LaunchMyNFT.`,
    image: `/${_edition}.png`,
    edition: _edition,
    date: dateTime,
    attributes: attributesList,
  };
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    resolve({ layer: _layer, loadedImage: image });
  });
};

const drawElement = (_element) => {
  ctx.drawImage(
    _element.loadedImage,
    _element.layer.position.x,
    _element.layer.position.y,
    _element.layer.size.width,
    _element.layer.size.height
  );
  addAttributes(_element);
};

const constructLayerToDna = (_dna = [], _races = [], _race) => {
  let mappedDnaToLayers = _races[_race].layers.map((layer, index) => {
    let selectedElement = layer.elements.find((e) => e.id == _dna[index]);
    return {
      name: layer.name,
      position: layer.position,
      size: layer.size,
      selectedElement: selectedElement,
    };
  });

  return mappedDnaToLayers;
};

const getRace = (_editionCount) => {
  raceWeights.forEach((raceWeight) => {
    if (_editionCount >= raceWeight.from && _editionCount <= raceWeight.to) {
      race = raceWeight.value;
    }
  });
  return race;
};

const isDnaUnique = (_DnaList = [], _dna = []) => {
  let foundDna = _DnaList.find((i) => i.join("") === _dna.join(""));
  return foundDna == undefined ? true : false;
};

const createDna = (_races, _race) => {
  let randNum = [];
  _races[_race].layers.forEach((layer) => {
    let randElementNum = Math.floor(Math.random() * 100); // change if you have more than 100 layers in 1 trait
    let num = 0;
    layer.elements.forEach((element) => {
      if (randElementNum >= 100 - element.weight) {
        // 100 must match the # on line 102
        num = element.id;
      }
    });
    randNum.push(num);
  });
  return randNum;
};

const writeMetaData = (_data, outputFolder) => {
  fs.writeFileSync(`${outputFolder}/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount, outputFolder) => {
  fs.writeFileSync(
    `${outputFolder}/${_editionCount}.json`,
    JSON.stringify(metadataList.find((meta) => meta.edition == _editionCount))
  );
};

const startCreating = async (
  races,
  outputFolder,
  contractName,
  collectionName
) => {
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  writeMetaData("", outputFolder);
  let editionCount = startEditionFrom;

  while (editionCount <= endEditionAt) {
    let race = getRace(editionCount);
    let newDna = createDna(races, race);

    if (isDnaUnique(dnaList, newDna)) {
      let results = constructLayerToDna(newDna, races, race);
      let loadedElements = []; //promise array
      results.forEach((layer) => {
        loadedElements.push(loadLayerImg(layer));
      });

      await Promise.all(loadedElements).then((elementArray) => {
        ctx.clearRect(0, 0, width, height);
        elementArray.forEach((element) => {
          drawElement(element);
        });
        saveImage(editionCount, outputFolder);

        addMetadata(newDna, editionCount, contractName);
        saveMetaDataSingleFile(editionCount, outputFolder);
        console.log(
          `Created edition: ${editionCount}, Race: ${race} with DNA: ${newDna}`
        );
      });
      dnaList.push(newDna);
      editionCount++;
    } else {
      console.log("DNA exists!");
    }
  }
  writeMetaData(JSON.stringify(metadataList), outputFolder);
};

module.exports = { startCreating };
