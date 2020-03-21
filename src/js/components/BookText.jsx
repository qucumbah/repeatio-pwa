import React from 'react';
import PropTypes from 'prop-types';
import Cheerio from 'cheerio';

const BookText = React.forwardRef((props, ref) => {
  const { source } = props;
  const $ = Cheerio.load(source, { xmlMode: true });
  const dom = new DOMParser().parseFromString(source, 'text/xml');
  console.log(dom, $);
  return (
    <div ref={ref}>
      {dom.getElementsByTagName('body')[0].innerHTML}
    </div>
  );
});

BookText.propTypes = {
  source: PropTypes.string.isRequired,
};

export default BookText;
