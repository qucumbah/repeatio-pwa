import React from 'react';
import PropTypes from 'prop-types';

const BookRenderer = ({ source }) => {
  const dom = new DOMParser().parseFromString(source, 'text/xml');
  return (
    <div className="bookRenderer">
      {dom.getElementsByTagName('body')[0].innerHTML}
    </div>
  );
};

BookRenderer.propTypes = {
  source: PropTypes.string.isRequired,
};

export default BookRenderer;
