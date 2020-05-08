import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Translation from './Translation';

const RepeatListItem = ({ word, onWordEdit, onWordRemove }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(word.text);

  const confirmWordEdit = (event) => {
    setIsFocused(false);
    onWordEdit(word.time, event.target.value);
  };

  const translationContainerStyle = {
    display: isFocused ? 'block' : 'none',
  };

  return (
    <li className="repeatListItem">
      <div className="wordContainer">
        <div className="word">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={confirmWordEdit}
          />
        </div>
        <button
          className="removeButton"
          type="button"
          aria-label="remove word"
          onClick={() => onWordRemove(word.time)}
        />
      </div>
      <div className="translationContainer" style={translationContainerStyle}>
        <Translation text={text} />
      </div>
    </li>
  );
};

RepeatListItem.propTypes = {
  word: PropTypes.exact({
    text: PropTypes.string,
    time: PropTypes.number,
  }).isRequired,
  onWordEdit: PropTypes.func.isRequired,
  onWordRemove: PropTypes.func.isRequired,
};

export default RepeatListItem;
