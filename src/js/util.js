import JsZip from 'jszip';

const translationApiKey = 'trnsl.1.1.20200422T083917Z.28cbd2f52df07dcd.a776528bbd937c69b808570840b48a58224acf25';
const dictionaryApiKey = 'dict.1.1.20190711T095338Z.484d81ae92e52b2a.f377215fa79771b02fb5f2343803aa24876acbe2';

export const getTranslation = (text) => {
  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return Promise.resolve('');
  }

  const dictionaryApiRequest = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${dictionaryApiKey}&lang=en-ru&text=${text}`;
  const translationApiRequest = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${translationApiKey}&lang=en-ru&text=${text}`;

  return Promise.all([
    fetch(dictionaryApiRequest),
    fetch(translationApiRequest),
  ])
    .then(([dictionaryApiResponse, translationApiResponse]) => Promise.all([
      dictionaryApiResponse.json(),
      translationApiResponse.json(),
    ]))
    .then(([dictionaryResponseJson, translationResponseJson]) => {
      const dictionaryApiHasResult = (dictionaryResponseJson.def.length !== 0);
      if (dictionaryApiHasResult) {
        return dictionaryResponseJson.def.map((definition) => {
          const joinedTranslations = definition.tr
            .map((translation) => translation.text)
            .join(', ');

          return `${definition.pos}:\n${joinedTranslations}`;
        }).join('\n');
      }

      return translationResponseJson.text[0];
    });
};

const jsZip = new JsZip();
export const unzipFiles = (zippedBuffer) => jsZip
  .loadAsync(zippedBuffer)
  .then(async (archive) => {
    const files = new Map();
    const addFileIfNotDir = async ([fileName, fileInfo]) => {
      if (fileInfo.dir) {
        return;
      }

      const file = await archive.file(fileName).async('arraybuffer');
      files.set(fileName, file);
    };

    const fileAdditions = Object.entries(archive.files).map(addFileIfNotDir);
    await Promise.all(fileAdditions);

    return files;
  });

export const convertToBase64 = (binary) => {
  const bytes = new Uint8Array(binary);

  const chars = [];
  bytes.forEach((byte) => chars.push(String.fromCharCode(byte)));

  const string = chars.join('');
  return window.btoa(string);
};

export const relativePathToAbsolute = (fromPath, toPath) => {
  if (fromPath.indexOf('/') === -1) {
    return toPath;
  }

  const fromFolder = fromPath.slice(0, fromPath.lastIndexOf('/'));
  const toFolder = toPath.slice(0, toPath.lastIndexOf('/'));

  const fromFolderKeypoints = fromFolder.split('/');
  const toFolderKeypoints = toFolder.split('/');

  const resultKeypoints = fromFolderKeypoints.slice();
  toFolderKeypoints.forEach((keypoint) => {
    if (keypoint === '..') {
      resultKeypoints.pop();
      return;
    }

    resultKeypoints.push(keypoint);
  });

  const toFileName = toPath.slice(toPath.lastIndexOf('/') + 1);
  return `${resultKeypoints.join('/')}/${toFileName}`;
};
