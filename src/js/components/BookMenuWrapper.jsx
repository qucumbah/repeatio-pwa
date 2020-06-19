import React, { useContext, useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { SettingsContext } from './SettingsProvider';

import MobileBookMenu from './MobileBookMenu';
import Overlay from './Overlay';
import MenuLink from './MenuLink';
import Settings from './Settings';
import RepeatList from './RepeatList';

import ReturnIcon from '../../img/return.svg';
import SettingsIcon from '../../img/settings.svg';
import RepeatListIcon from '../../img/book.svg';
import PinIcon from '../../img/pin.svg';
import Bars from '../../img/bars.svg';
import PlusIcon from '../../img/plus.svg';
import MinusIcon from '../../img/minus.svg';

const BookMenuWrapper = ({ onBookClose, children }) => {
  const [isPinned, setIsPinned] = useState(false);

  const [overlayOpenFrom, setOverlayOpenFrom] = useState(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const openOverlay = (event) => {
    setOverlayOpenFrom({
      x: event.pageX,
      y: event.pageY,
    });
    setOverlayOpen(true);
  };

  const settings = <Settings onClose={() => setOverlayOpen(false)} />;
  const repeatList = <RepeatList onClose={() => setOverlayOpen(false)} />;

  const [desktopMenuContent, setDesktopMenuContent] = useState(null);

  const openOverlayWith = (content) => (event) => {
    setDesktopMenuContent(content);
    openOverlay(event);
  };

  const {
    fontSize,
    setFontSize,
  } = useContext(SettingsContext);

  const desktopTopBarRef = useRef();
  const desktopTopBar = (
    <div className="desktopTopBar list" ref={desktopTopBarRef}>
      <MenuLink action={onBookClose} icon={ReturnIcon}>
        Close book
      </MenuLink>
      <MenuLink action={openOverlayWith(settings)} icon={SettingsIcon}>
        Settings
      </MenuLink>
      <MenuLink action={openOverlayWith(repeatList)} icon={RepeatListIcon}>
        Repeat list
      </MenuLink>
      <MenuLink action={() => setIsPinned(!isPinned)} icon={PinIcon}>
        {isPinned ? 'Unpin menu' : 'Pin menu'}
      </MenuLink>
      <div className="fontSize">
        <MenuLink
          action={() => setFontSize(fontSize + 1)}
          icon={PlusIcon}
        />
        <MenuLink
          action={() => setFontSize(fontSize - 1)}
          icon={MinusIcon}
        />
      </div>
      {children}
    </div>
  );

  const mobileMenu = (
    <MobileBookMenu onClose={() => setOverlayOpen(false)} />
  );
  const mobileTopBar = (
    <MenuLink action={openOverlay} icon={Bars}>Open menu</MenuLink>
  );

  const [mobileVersion, setMobileVersion] = useState(false);
  useLayoutEffect(() => {
    if (mobileVersion) {
      return;
    }

    const desktopMenuWidth = (
      desktopTopBarRef.current.getBoundingClientRect().width
    );
    const pageChangeButtonWidth = 100;

    if (desktopMenuWidth > window.innerWidth - (2 * pageChangeButtonWidth)) {
      setMobileVersion(true);
      setIsPinned(true);
    }
  });

  return (
    <div className="bookMenuWrapper">
      <Overlay shouldOpen={overlayOpen} from={overlayOpenFrom}>
        {mobileVersion ? mobileMenu : desktopMenuContent}
      </Overlay>
      <div className={`barsContainer ${isPinned ? 'pinned' : 'unpinned'}`}>
        <div className="topBar">
          {mobileVersion ? mobileTopBar : desktopTopBar}
        </div>
        <div className="bottomBar">
          <MenuLink>Hover to see menu</MenuLink>
        </div>
      </div>
    </div>
  );
};

BookMenuWrapper.propTypes = {
  onBookClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

BookMenuWrapper.defaultProps = {
  children: null,
};

export default BookMenuWrapper;
