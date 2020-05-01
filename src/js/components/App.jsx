import React, { useState, useMemo, useEffect } from 'react';
import { SettingsProvider } from './SettingsProvider';
import FileChooserDropzone from './FileChooserDropzone';
import FileOverlay from './FileOverlay';
import Overlay from './Overlay';
import Settings from './Settings';
import RepeatList from './RepeatList';
import Help from './Help';
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
      time
    })));
  };
  const removeWord = (time) => {
    setWords((prevWords) => prevWords.filter((word) => word.time !== time));
  };
  console.log(words);

  useEffect(() => {
    addWord('first');
    addWord('second');
  }, []);

  const [overlayOpenFrom, setOverlayOpenFrom] = useState(null);

  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const openSettingsMenu = (event) => {
    setOverlayOpenFrom({
      x: event.pageX,
      y: event.pageY,
    });
    setSettingsMenuOpen(true);
  };

  const [repeatListOpen, setRepeatListOpen] = useState(false);
  const openrepeatList = (event) => {
    setOverlayOpenFrom({
      x: event.pageX,
      y: event.pageY,
    });
    setRepeatListOpen(true);
  };

  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const openHelpMenu = (event) => {
    setOverlayOpenFrom({
      x: event.pageX,
      y: event.pageY,
    });
    setHelpMenuOpen(true);
  };

  const mainPage = (
    <MainPage
      onFileChange={changeBookFile}
      onSettingsMenuOpen={openSettingsMenu}
      onRepeatListOpen={openrepeatList}
      onHelpMenuOpen={openHelpMenu}
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
    <SettingsProvider>
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

      <Overlay shouldOpen={repeatListOpen} from={overlayOpenFrom}>
        <RepeatList
          words={words}
          onClose={() => setRepeatListOpen(false)}
          onWordAdd={addWord}
          onWordEdit={editWord}
          onWordRemove={removeWord}
        />
      </Overlay>

      <Overlay shouldOpen={helpMenuOpen} from={overlayOpenFrom}>
        <Help onClose={() => setHelpMenuOpen(false)} />
      </Overlay>

      {showBookUi ? bookUi : mainPage}
    </SettingsProvider>
  );
};

export default App;
