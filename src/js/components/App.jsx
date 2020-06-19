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
import Fb2Ui from './Fb2Ui';
import PdfUi from './PdfUi';

const App = () => {
  const [book, setBook] = useState(null);
  const [fileOverlayContent, setFileOverlayContent] = useState(null);

  const handleFileDrag = (isFileDragged) => {
    setFileOverlayContent(isFileDragged ? 'Drop FB2 Here' : null);
  };

  const getBook = async (file) => {
    const getFormat = () => {
      if (file.name.endsWith('.pdf')) {
        return 'pdf';
      }

      if (file.name.endsWith('.fb2')) {
        return 'fb2';
      }

      return null;
    };

    const getPdfData = () => new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
    });
    const getFb2Data = () => new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
    });

    const format = getFormat();
    if (format === null) {
      return null;
    }
    const source = await ((format === 'pdf') ? getPdfData() : getFb2Data());

    return {
      format,
      source,
    };
  };

  const changeBookFile = (file) => {
    // Before rendering frame 1: set loader visible
    requestAnimationFrame(() => {
      setFileOverlayContent('Loading...');

      // Before rendering frame 2: make all work, set loader invisible
      requestAnimationFrame(async () => {
        setBook(await getBook(file));
        setFileOverlayContent(null);
      });
    });
  };

  const handleBookInfoChange = (newBookInfo) => {
    const {
      author,
      title,
    } = newBookInfo;
    document.title = `${title} - ${author}`;
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
  const getFb2Ui = () => (
    <Fb2Ui
      source={book.source}
      onBookClose={() => setBook(null)}
      onBookInfoChange={handleBookInfoChange}
    />
  );
  const getPdfUi = () => (
    <PdfUi
      source={book.source}
      onBookClose={() => setBook(null)}
      onBookInfoChange={handleBookInfoChange}
    />
  );
  const bookUi = useMemo(() => {
    switch (book?.format) {
      case 'fb2': return getFb2Ui();
      case 'pdf': return getPdfUi();
      default: return null;
    }
  }, [book]);

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

        {(book === null) ? mainPage : bookUi}
      </RepeatListProvider>
    </SettingsProvider>
  );
};

export default App;
