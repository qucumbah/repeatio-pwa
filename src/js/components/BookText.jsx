import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Cheerio from 'cheerio';

const getInfo = ($) => ({
  title: $('description book-title').eq(0).text(),
  authorFirstName: $('description author first-name').eq(0).text(),
  authorLastName: $('description author last-name').eq(0).text(),
});

const getImages = ($) => {
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
  if (!tagName) {
    return null;
  }

  // Title inside body = chapter's name; can't have children
  if (type === 'tag' && tagName === 'title') {
    return <h1 key={index}>{$ofNode.text()}</h1>;
  }

  const switchXmlTagName = {
    epigraph: 'blockquote',
    section: 'section',
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
  // It's ok to use index as key here, the content wont change unless the entire
  // book has changed
  return Array.from(bodies).map(xmlToHtml);
};

const BookText = React.memo((props) => {
  const { source, onBookInfoChange } = props;
  const $ = Cheerio.load(source, { xmlMode: true });
  const dom = new DOMParser().parseFromString(source, 'text/xml');
  console.log(dom);

  const info = getInfo($);
  const images = getImages($);
  const content = getContent($);

  useEffect(() => {
    onBookInfoChange(info);
  }, [source]);

  return (
    <div>
      {content}
    </div>
  );
});

BookText.propTypes = {
  source: PropTypes.string.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
};

export default BookText;
