import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const RepeatListItem = ({ word, onWordEdit, onWordRemove }) => {
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef();

  const confirmWordEdit = () => {
    onWordEdit(word.time, inputRef.current.value);
    setIsEditing(false);
  };

  const cancelWordEdit = () => {
    inputRef.current.value = word.text;
    setIsEditing(false);
  };

  const cancelEditButton = (
    <button
      className="cancelEditButton"
      type="button"
      aria-label="cancel word edition"
      onClick={cancelWordEdit}
    />
  );

  const removeButton = (
    <button
      className="removeButton"
      type="button"
      aria-label="remove word"
      onClick={() => onWordRemove(word.time)}
    />
  );

  return (
    <li className="repeatListItem">
      <div className="word">
        <input
          type="text"
          defaultValue={word.text}
          ref={inputRef}
          onClick={() => setIsEditing(true)}
          onBlur={confirmWordEdit}
        />
      </div>
      {isEditing ? cancelEditButton : removeButton}
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
