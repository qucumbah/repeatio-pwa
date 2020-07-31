import React from 'react';
import PropTypes from 'prop-types';
import Cheerio from 'cheerio';

import { convertToBase64, relativePathToAbsolute } from '../util';

const textDecoder = new TextDecoder('utf-8');

const extractImageFromBinary = (imageBinary, imageFormat) => {
  const imageBase64 = convertToBase64(imageBinary);
  const href = `data:image/${imageFormat};base64,${imageBase64}`;
  return <img src={href} alt="" />;
};

const cheerioNodeToReactComponent = (node, index) => {
  const {
    type,
    tagName,
    data,
    children,
  } = node;

  // Don't have to create any elements for text
  if (type === 'text') {
    return (data.trim().length === 0) ? null : data;
  }

  return React.createElement(
    tagName,
    {
      key: index,
      elementid: index,
    },
    children.map(cheerioNodeToReactComponent),
  );
};

const extractHtmlFromBinary = (htmlBinary) => {
  const html = textDecoder.decode(htmlBinary);
  const $ofHtml = Cheerio.load(html);
  const bodyChildrensNodes = Array.from($ofHtml('body > *'));

  return bodyChildrensNodes.map(cheerioNodeToReactComponent);
};

const EpubText = React.memo(
  React.forwardRef((props, ref) => {
    const { source, onBookInfoChange } = props;

    const get$ = (filePath) => {
      const fileBuffer = source.get(filePath);
      const fileString = textDecoder.decode(fileBuffer);
      return Cheerio.load(fileString, { xmlMode: true });
    };

    const $ofContainer = get$('META-INF/container.xml');

    const convertRootFileToHtml = (rootFilePath) => {
      const $ofRootFile = get$(rootFilePath);

      const $ofItemElements = $ofRootFile('manifest item');
      const itemsInfo = Array.from($ofItemElements).map(
        (itemInfo) => itemInfo.attribs
      );

      const extractItem = (itemMediaType, itemBinary) => {
        if (itemMediaType === 'application/xhtml+xml') {
          return extractHtmlFromBinary(itemBinary);
        }

        if (itemMediaType.startsWith('image')) {
          const imageFormatStart = itemMediaType.lastIndexOf('/') + 1;
          const imageFormat = itemMediaType.slice(imageFormatStart);
          return extractImageFromBinary(itemBinary, imageFormat);
        }

        return null;
      };

      const itemsContent = new Map();
      itemsInfo.forEach((itemInfo) => {
        const itemMediaType = itemInfo['media-type'];
        const itemBinary = source.get(itemInfo.href);

        const extractedItem = extractItem(itemMediaType, itemBinary);
        if (extractedItem !== null) {
          itemsContent.set(itemInfo.id, extractedItem);
        }
      });

      const referencesInfo = Array.from($ofRootFile('spine itemref'));
      const references = referencesInfo.map(
        (referenceInfo) => referenceInfo.attribs.idref
      );

      return references.map((reference) => itemsContent.get(reference));
    };

    const rootFilesInfo = Array.from($ofContainer('rootfile'));
    const content = rootFilesInfo.map((rootFileInfo) => {
      const rootFilePath = rootFileInfo.attribs['full-path'];

      return convertRootFileToHtml(rootFilePath);
    });

    console.log(content);

    return (
      <div className="epubText" ref={ref}>
        {content}
      </div>
    );
  })
);

EpubText.propTypes = {
  source: PropTypes.instanceOf(Map).isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
};

export default EpubText;
