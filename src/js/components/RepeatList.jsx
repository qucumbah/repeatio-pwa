import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import RepeatListItem from './RepeatListItem';

const RepeatList = (props) => {
  const {
    words,
    onClose,
    onWordAdd,
    onWordEdit,
    onWordRemove,
  } = props;

  return (
    <div className="overlayMenu repeatList">
      <h2>Repeat list</h2>
      <ul className="list">
        {words.map((word) => (
          <RepeatListItem
            word={word}
            onWordEdit={onWordEdit}
            onWordRemove={onWordRemove}
            key={word.time}
          />
        ))}
      </ul>
      <button
        className="closeButton"
        type="button"
        aria-label="close"
        onClick={onClose}
      />
    </div>
  );
};

RepeatList.propTypes = {
  words: PropTypes.arrayOf(PropTypes.exact({
    text: PropTypes.string,
    time: PropTypes.number,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
  onWordAdd: PropTypes.func.isRequired,
  onWordEdit: PropTypes.func.isRequired,
  onWordRemove: PropTypes.func.isRequired,
};

export default RepeatList;
