import React, { useState, useMemo } from 'react';
import FileChooserDropzone from './FileChooserDropzone';
import Loader from './Loader';
import MainPage from './MainPage';
import BookUI from './BookUI';

const App = () => {
  const [bookSource, setBookSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const changeBookFile = (file) => {
    const makeAllWorkAndHideLoader = () => {
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        setBookSource(reader.result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setIsLoading(false);
      };
    };

    // Before rendering frame 1: set loader visible
    requestAnimationFrame(() => {
      setIsLoading(true);

      // Before rendering frame 2: make all work, set loader invisible
      requestAnimationFrame(() => {
        makeAllWorkAndHideLoader();
      });
    });
  };

  const handleBookInfoChange = (newBookInfo) => {
    const {
      authorFirstName,
      authorLastName,
      title,
    } = newBookInfo;
    document.title = `${title} - ${authorFirstName} ${authorLastName}`;
  };

  const [words, setWords] = useState([]);
  const addWord = (newWord) => {
    console.log(words);
    setWords((prevWords) => prevWords.push(newWord));
  };

  const bookUi = useMemo(() => (
    <BookUI
      source={bookSource}
      onBookInfoChange={handleBookInfoChange}
      onWordAdd={addWord}
    />
  ), [bookSource]);
  const mainPage = <MainPage onFileChange={changeBookFile} />;

  return (
    <>
      <FileChooserDropzone onFileChange={changeBookFile} />
      <Loader isLoading={isLoading} />
      {bookSource ? bookUi : mainPage}
    </>
  );
};

export default App;
