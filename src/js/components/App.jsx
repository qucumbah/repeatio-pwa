import React, { useState, useMemo } from 'react';
import FileChooserDropzone from './FileChooserDropzone';
import FileOverlay from './FileOverlay';
import Overlay from './Overlay';
import Settings from './Settings';
import MainPage from './MainPage';
import BookUI from './BookUI';

const App = () => {
  const [bookSource, setBookSource] = useState(null);
  const [fileOverlayContent, setFileOverlayContent] = useState(null);

  const handleFileDrag = (isFileDragged) => {
    setFileOverlayContent(isFileDragged ? 'Drop FB2 Here' : null);
  };

  const changeBookFile = (file) => {
    const makeAllWorkAndHideOverlay = () => {
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        setBookSource(reader.result);
        setFileOverlayContent(null);
      };
      reader.onerror = () => {
        setFileOverlayContent(null);
      };
    };

    // Before rendering frame 1: set loader visible
    requestAnimationFrame(() => {
      setFileOverlayContent('Loading...');

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
    setWords((prevWords) => [...prevWords, newWord]);
  };
  console.log(words);

  const [overlayOpenFrom, setOverlayOpenFrom] = useState(null);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const openSettingsMenu = (event) => {
    setOverlayOpenFrom({
      x: event.pageX,
      y: event.pageY,
    });
    setSettingsMenuOpen(true);
  };

  const mainPage = (
    <MainPage
      onFileChange={changeBookFile}
      onSettingsMenuOpen={openSettingsMenu}
      onHelpMenuOpen={() => null}
      onSignupMenuOpen={() => null}
      onLoginMenuOpen={() => null}
    />
  );
  const bookUi = useMemo(() => (
    <BookUI
      source={bookSource}
      onBookInfoChange={handleBookInfoChange}
      onWordAdd={addWord}
    />
  ), [bookSource]);
  const showBookUi = bookSource !== null;

  return (
    <>
      <FileChooserDropzone
        onFileDrag={handleFileDrag}
        onFileChange={changeBookFile}
      />
      <FileOverlay
        isVisible={fileOverlayContent !== null}
        content={(fileOverlayContent === null) ? '' : fileOverlayContent}
      />

      <Overlay shouldOpen={settingsMenuOpen} from={overlayOpenFrom}>
        <Settings onClose={() => setSettingsMenuOpen(false)} />
      </Overlay>

      {showBookUi ? bookUi : mainPage}
    </>
  );
};

export default App;
