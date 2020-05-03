import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { RepeatListContext } from './RepeatListProvider';

import RepeatListItem from './RepeatListItem';

const RepeatList = ({ onClose }) => {
  const {
    words,
    onWordEdit,
    onWordRemove,
  } = useContext(RepeatListContext);

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
  onClose: PropTypes.func.isRequired,
};

export default RepeatList;
