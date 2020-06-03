import React from 'react';
import PropTypes from 'prop-types';

const PdfUi = () => {

};

PdfUi.propTypes = {
  source: PropTypes.string,
  onBookClose: PropTypes.func.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
};

PdfUi.defaultProps = {
  source: '',
};

export default PdfUi;
