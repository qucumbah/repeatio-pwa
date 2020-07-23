import React, { useState, useMemo } from 'react';
import { unzipFiles } from '../util';

import { SettingsProvider } from './SettingsProvider';
import { RepeatListProvider } from './RepeatListProvider';
import FileChooserDropzone from './FileChooserDropzone';
import FileOverlay from './FileOverlay';
import Overlay from './Overlay';
import Settings from './Settings';
import RepeatList from './RepeatList';
import Help from './Help';
import MainPage from './MainPage';
import XmlUi from './XmlUi';
import PdfUi from './PdfUi';

const App = () => {
  const [book, setBook] = useState(null);
  const [fileOverlayContent, setFileOverlayContent] = useState(null);

  const handleFileDrag = (isFileDragged) => {
    setFileOverlayContent(isFileDragged ? 'Drop FB2 Here' : null);
  };

  const getBook = async (file) => {
    const getFormat = () => {
      const supportedFormats = ['pdf', 'fb2', 'epub'];

      const result = supportedFormats.find(
        (format) => file.endsWith(`.${format}`)
      );

      return result ?? 'unsupported';
    };

    const readFileAsText = () => new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
    });
    const readFileAsArrayByffer = () => new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
    });

    const getData = async (format) => {
      switch (format) {
        case 'pdf':
          return readFileAsArrayByffer();
        case 'fb2':
          return readFileAsText();
        case 'epub':
          return unzipFiles(await readFileAsArrayByffer());
        default:
          return null;
      }
    };

    const format = getFormat();
    if (format === null) {
      return null;
    }
    const source = await getData(format);

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
    <XmlUi
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
