// It's ok to use index as key here, the content wont change unless the entire
// book has changed
/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Cheerio from 'cheerio';

const getInfo = ($) => {
  const title = $('description book-title').eq(0).text();
  const authorFirstName = $('description author first-name').eq(0).text();
  const authorLastName = $('description author last-name').eq(0).text();

  return {
    title,
    author: `${authorFirstName} ${authorLastName}`,
  };
};

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

    const h1Children = titleInnerTextNodes.map((textNode, textNodeIndex) => (
      <span
        xmltagname="p-inside-title"
        key={`text ${textNodeIndex}`}
      >
        {textNode}
      </span>
    ));
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
    strong: 'b',
    p: 'p',
  };

  const htmlTagName = switchXmlTagName[tagName];
  if (!htmlTagName) {
    console.log(tagName);
  }

  // Switch all unknown tag names to div
  return React.createElement(
    htmlTagName || 'div',
    {
      key: index,
      xmltagname: tagName,
      xmltagid: index,
      ...attribs,
    },
    children.map(xmlToHtml),
  );
};

const getContent = ($) => {
  const bodies = $('body');
  return Array.from(bodies).map(xmlToHtml);
};

const Fb2Text = React.memo(
  React.forwardRef((props, ref) => {
    const { source, onBookInfoChange } = props;
    const $ = Cheerio.load(source, { xmlMode: true });

    const info = getInfo($);
    useEffect(() => {
      onBookInfoChange(info);
    }, [source]);

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

    return (
      <div className="fb2Text" ref={ref}>
        {content}
      </div>
    );
  })
);

Fb2Text.propTypes = {
  source: PropTypes.string.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
};

export default Fb2Text;
