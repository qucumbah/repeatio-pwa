import React, { useState, useRef, useLayoutEffect } from 'react';

import MobileBookMenu from './MobileBookMenu';
import Overlay from './Overlay';
import MenuLink from './MenuLink';
import Settings from './Settings';
import RepeatList from './RepeatList';

import SettingsIcon from '../../img/settings.svg';
import RepeatListIcon from '../../img/book.svg';
import PinIcon from '../../img/pin.svg';
import Bars from '../../img/bars.svg';

const BookMenuWrapper = () => {
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

  const desktopTopBarRef = useRef();
  const desktopTopBar = (
    <ul className="desktopTopBar list" ref={desktopTopBarRef}>
      <li>
        <MenuLink action={openOverlayWith(settings)} icon={SettingsIcon}>
          Settings
        </MenuLink>
        <MenuLink action={openOverlayWith(repeatList)} icon={RepeatListIcon}>
          Repeat list
        </MenuLink>
        <MenuLink action={() => setIsPinned(!isPinned)} icon={PinIcon}>
          {isPinned ? 'Unpin menu' : 'Pin menu'}
        </MenuLink>
      </li>
    </ul>
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

export default BookMenuWrapper;
