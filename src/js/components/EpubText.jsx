import React from 'react';
import PropTypes from 'prop-types';
import Cheerio from 'cheerio';

import { convertToBase64, relativePathToAbsolute } from '../util';

const textDecoder = new TextDecoder('utf-8');

const getImageBase64Href = (source, imagePath) => {
  const imageBinary = source.get(imagePath);
  const imageBase64 = convertToBase64(imageBinary);

  const imageFormatStart = imagePath.lastIndexOf('.') + 1;
  const imageFormat = imagePath.slice(imageFormatStart);

  return `data:image/${imageFormat};base64,${imageBase64}`;
};

const cheerioNodeToReactComponent = (node, index) => {
  const {
    type,
    tagName,
    data,
    children,
  } = node;

  if (tagName === 'img') {
    return <img src={node.attribs.src} alt="" key={index} elementid={index} />;
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

const extractHtml = (rootFilePath, htmlPageRelativePath, source) => {
  const htmlPageAbsolutePath = (
    relativePathToAbsolute(rootFilePath, htmlPageRelativePath)
  );
  const htmlPageBinary = source.get(htmlPageAbsolutePath);

  const html = textDecoder.decode(htmlPageBinary);
  const $ofHtml = Cheerio.load(html);

  const images = Array.from($ofHtml('img'));
  images.forEach((image) => {
    const imageRelativePath = image.attribs.src;
    const imageAbsolutePath = (
      relativePathToAbsolute(htmlPageAbsolutePath, imageRelativePath)
    );

    // Have to change src attribute here image paths won't work
    // eslint-disable-next-line no-param-reassign
    image.attribs.src = getImageBase64Href(source, imageAbsolutePath);
    // console.log(getImageBase64Href(source, imageAbsolutePath));
  });

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

    const rootFilesInfo = Array.from($ofContainer('rootfile'));
    const content = rootFilesInfo.map((rootFileInfo) => {
      const rootFilePath = rootFileInfo.attribs['full-path'];
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
        const htmlPage = (
          extractHtml(rootFilePath, htmlPageRelativePath, source)
        );

        const pageId = itemInfo.id;
        htmlPages.set(pageId, htmlPage);
      });

      const referencesInfo = Array.from($ofRootFile('spine itemref'));
      const references = referencesInfo.map(
        (referenceInfo) => referenceInfo.attribs.idref
      );

      return references.map((reference) => htmlPages.get(reference));
    });

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
