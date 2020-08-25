import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getTranslation } from '../util';

const Translation = ({ text }) => {
  const [translation, setTranslation] = useState(null);

  useEffect(() => {
    setTranslation(null);
    getTranslation(text).then(setTranslation);
  }, [text]);

  return (
    <div className="translation">
      {translation === null ? <span className="placeholder" /> : translation}
    </div>
  );
};

Translation.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Translation;
