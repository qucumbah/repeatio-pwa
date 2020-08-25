import JsZip from 'jszip';

const dictionaryApiKey = 'dict.1.1.20190711T095338Z.484d81ae92e52b2a.f377215fa79771b02fb5f2343803aa24876acbe2';

export const getTranslation = async (text) => {
  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return Promise.resolve('');
  }

  const dictionaryApiRequest = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${dictionaryApiKey}&lang=en-ru&text=${text}`;

  const [
    dictionaryApiResponse,
  ] = await Promise.allSettled([
    fetch(dictionaryApiRequest),
  ]);

  if (dictionaryApiResponse.status === 'fulfilled') {
    const dictionaryResponseJson = await dictionaryApiResponse.value.json();
    const dictionaryApiHasResult = (dictionaryResponseJson.def.length !== 0);

    if (dictionaryApiHasResult) {
      return dictionaryResponseJson.def.map((definition) => {
        const joinedTranslations = definition.tr
          .map((translation) => translation.text)
          .join(', ');

        return `${definition.pos}:\n${joinedTranslations}`;
      }).join('\n');
    }
  }

  return 'Translation error';
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
