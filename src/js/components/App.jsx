import React, { useState, useMemo } from 'react';
import FileChooserDropzone from './FileChooserDropzone';
import Overlay from './Overlay';
import MainPage from './MainPage';
import BookUI from './BookUI';

const App = () => {
  const [bookSource, setBookSource] = useState(null);
  const [overlayContent, setOverlayContent] = useState(null);

  const handleFileDrag = (isFileDragged) => {
    setOverlayContent(isFileDragged ? 'Drop FB2 Here' : null);
  };

  const changeBookFile = (file) => {
    const makeAllWorkAndHideOverlay = () => {
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        setBookSource(reader.result);
        setOverlayContent(null);
      };
      reader.onerror = () => {
        setOverlayContent(null);
      };
    };

    // Before rendering frame 1: set loader visible
    requestAnimationFrame(() => {
      setOverlayContent('Loading...');

      // Before rendering frame 2: make all work, set loader invisible
      requestAnimationFrame(() => {
        makeAllWorkAndHideOverlay();
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
  const showBookUi = bookSource !== null;

  return (
    <>
      <FileChooserDropzone
        onFileDrag={handleFileDrag}
        onFileChange={changeBookFile}
      />
      <Overlay
        isVisible={overlayContent !== null}
        content={(overlayContent === null) ? '' : overlayContent}
      />

      {showBookUi ? bookUi : mainPage}
    </>
  );
};

export default App;
