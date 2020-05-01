import React from 'react';
import PropTypes from 'prop-types';

const RepeatListItem = ({ word, onWordEdit, onWordRemove }) => (
  <li className="repeatListItem">
    <div className="word">
      <input
        type="text"
        defaultValue={word.text}
      />
    </div>
    <button
      className="removeButton"
      type="button"
      aria-label="remove word"
      onClick={() => onWordRemove(word.time)}
    />
  </li>
);

RepeatListItem.propTypes = {
  word: PropTypes.exact({
    text: PropTypes.string,
    time: PropTypes.number,
  }).isRequired,
  onWordEdit: PropTypes.func.isRequired,
  onWordRemove: PropTypes.func.isRequired,
};

export default RepeatListItem;
