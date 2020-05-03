import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const RepeatListContext = React.createContext();

export const RepeatListProvider = ({ children }) => {
  const [words, setWords] = useState([]);
  const addWord = (newWordText) => {
    const newWord = {
      text: newWordText,
      time: Date.now(),
    };
    setWords((prevWords) => [...prevWords, newWord]);
  };
  const editWord = (time, newText) => {
    setWords((prevWords) => prevWords.map((word) => ({
      text: (word.time === time) ? newText : word.text,
      time: word.time,
    })));
  };
  const removeWord = (time) => {
    setWords((prevWords) => prevWords.filter((word) => word.time !== time));
  };

  useEffect(() => {
    addWord('first');
    new Promise((resolve) => setTimeout(resolve)).then(() => addWord('second'));
  }, []);

  const repeatList = {
    words,
    onWordAdd: addWord,
    onWordEdit: editWord,
    onWordRemove: removeWord,
  };

  return (
    <RepeatListContext.Provider value={repeatList}>
      {children}
    </RepeatListContext.Provider>
  );
};

RepeatListProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
