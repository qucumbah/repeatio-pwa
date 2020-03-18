import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ isLoading }) => {
  const className = `loader ${isLoading ? 'visible' : 'invisible'}`;
  return (
    <div className={className}>Loading...</div>
  );
};

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loader;
