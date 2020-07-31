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

  if (tagName === 'img') {
    return '---------IMAGE-----------';
  }

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
    (children.length !== 0) ? children.map(cheerioNodeToReactComponent) : null,
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

      const htmlPages = new Map();
      itemsInfo.forEach((itemInfo) => {
        const itemMediaType = itemInfo['media-type'];

        if (itemMediaType !== 'application/xhtml+xml') {
          return;
        }

        const htmlPageRelativePath = itemInfo.href;
        const htmlPageAbsolutePath = (
          relativePathToAbsolute(rootFilePath, htmlPageRelativePath)
        );
        const htmlPageBinary = source.get(htmlPageAbsolutePath);
        const htmlPage = extractHtmlFromBinary(htmlPageBinary);

        const pageId = itemInfo.id;
        htmlPages.set(pageId, htmlPage);
      });

      const referencesInfo = Array.from($ofRootFile('spine itemref'));
      const references = referencesInfo.map(
        (referenceInfo) => referenceInfo.attribs.idref
      );

      return references.map((reference) => htmlPages.get(reference));
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
