// It's ok to use index as key here, the content wont change unless the entire
// book has changed
/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Cheerio from 'cheerio';

const getInfo = ($) => ({
  title: $('description book-title').eq(0).text(),
  authorFirstName: $('description author first-name').eq(0).text(),
  authorLastName: $('description author last-name').eq(0).text(),
});

const getImagesBase64 = ($) => {
  const imageElements = $('binary');
  const result = {};
  Array.from(imageElements).forEach((node) => {
    const elem = $(node);
    const id = elem.attr('id');
    const imageData = elem.text();
    result[id] = imageData;
  });
  return result;
};

const xmlToHtml = (node, index) => {
  const {
    type,
    tagName,
    attribs,
    data,
    children,
  } = node;
  const $ofNode = Cheerio(node);

  // Handle text
  if (type === 'text') {
    return (data.trim().length === 0) ? null : data;
  }
  // We've handled text, skip everything that is not a tag from now on
  if (!tagName || type !== 'tag') {
    console.error(node); // Just wondering what that might be
    return null;
  }

  // Title inside body = chapter's name; can't have children
  if (tagName === 'title') {
    const titleChildren = $ofNode.children('p');
    const titleInnerTextNodes = Array.from(titleChildren).map((childNode) => {
      const $childNode = Cheerio(childNode);
      return $childNode.text();
    });

    const h1Children = [];
    titleInnerTextNodes.forEach((textNode, textNodeIndex) => {
      h1Children.push(<span key={`text ${textNodeIndex}`}>{textNode}</span>);
      if (index !== titleInnerTextNodes.length) {
        h1Children.push(<br key={`linebreak ${textNodeIndex}`} />);
      }
    });
    return <h1 key={index}>{h1Children}</h1>;
  }

  // Empty line never has children
  if (tagName === 'empty-line') {
    return <br key={index} />;
  }

  // Links have "l:href" attribute instead of "href", easy to fix
  if (tagName === 'a') {
    return <a href={$ofNode.attr('l:href')} key={index}>{$ofNode.text()}</a>;
  }

  // We've already replaced all image's href's with their base 64 image string
  // in render, now we just need to replace "l:href" with "src"
  if (tagName === 'image') {
    return (
      <img src={$ofNode.attr('l:href')} key={index} alt={$ofNode.attr('alt')} />
    );
  }

  const switchXmlTagName = {
    epigraph: 'blockquote',
    section: 'section',
    emphasis: 'i',
    p: 'p',
  };

  const htmlTagName = switchXmlTagName[tagName];

  // Switch all unknown tag names to div
  return React.createElement(
    htmlTagName || 'div',
    {
      key: index,
      xmltagname: tagName,
      ...attribs,
    },
    children.map(xmlToHtml),
  );
};

const getContent = ($) => {
  const bodies = $('body');
  return Array.from(bodies).map(xmlToHtml);
};

const BookText = React.memo(
  React.forwardRef((props, ref) => {
    const { source, onBookInfoChange } = props;
    const $ = Cheerio.load(source, { xmlMode: true });
    const dom = new DOMParser().parseFromString(source, 'text/xml');
    console.log(dom);

    const info = getInfo($);
    const imagesBase64 = getImagesBase64($);
    const images = $('image');
    Array.from(images).forEach((imageNode) => {
      const image = $(imageNode);
      const sourceName = image.attr('l:href');
      if (!sourceName.startsWith('#')) {
        return;
      }

      const imageBase64Name = sourceName.slice(1);
      const imageBase64 = imagesBase64[imageBase64Name];
      if (!imageBase64) {
        return;
      }

      image.attr('l:href', `data:image/png;base64,${imageBase64}`);
    });
    const content = getContent($);

    useEffect(() => {
      onBookInfoChange(info);
    }, [source]);

    return (
      <div ref={ref}>
        {content}
      </div>
    );
  // eslint-disable-next-line comma-dangle
  })
);

BookText.propTypes = {
  source: PropTypes.string.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
};

export default BookText;
