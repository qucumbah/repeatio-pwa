import React, { useState, useMemo } from 'react';

import { SettingsProvider } from './SettingsProvider';
import { RepeatListProvider } from './RepeatListProvider';
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
      chapterTitleElements,
    } = newBookInfo;
    console.log(chapterTitleElements);
    document.title = `${title} - ${authorFirstName} ${authorLastName}`;
  };

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
      onBookClose={() => setBookSource(null)}
      onBookInfoChange={handleBookInfoChange}
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

      <Overlay shouldOpen={helpMenuOpen} from={overlayOpenFrom}>
        <Help onClose={() => setHelpMenuOpen(false)} />
      </Overlay>

      <RepeatListProvider>
        <Overlay shouldOpen={repeatListOpen} from={overlayOpenFrom}>
          <RepeatList onClose={() => setRepeatListOpen(false)} />
        </Overlay>

        {showBookUi ? bookUi : mainPage}
      </RepeatListProvider>
    </SettingsProvider>
  );
};

export default App;
