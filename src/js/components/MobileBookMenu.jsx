import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import MenuLink from './MenuLink';
import FadeContainer from './FadeContainer';
import Settings from './Settings';
import RepeatList from './RepeatList';
import Help from './Help';

import SettingsIcon from '../../img/settings.svg';
import RepeatListIcon from '../../img/book.svg';
import FaqIcon from '../../img/info.svg';

const MobileBookMenu = ({ onClose }) => {
  const [contentType, setContentType] = useState('bookMenu');

  const bookMenu = (
    <div className="overlayMenu mobileBookMenu">
      <h2>BookMenu</h2>
      <ul className="list">
        <li>
          <MenuLink
            action={() => setContentType('settings')}
            icon={SettingsIcon}
          >
            Settings
          </MenuLink>
        </li>
        <li>
          <MenuLink
            action={() => setContentType('repeatList')}
            icon={RepeatListIcon}
          >
            Repeat list
          </MenuLink>
        </li>
        <li>
          <MenuLink
            action={() => setContentType('help')}
            icon={FaqIcon}
          >
            Help
          </MenuLink>
        </li>
      </ul>
      <button
        className="closeButton"
        type="button"
        aria-label="close"
        onClick={onClose}
      />
    </div>
  );

  const resetContent = () => setContentType('bookMenu');

  const getContent = (type) => {
    switch (type) {
      case 'bookMenu': return bookMenu;
      case 'settings': return <Settings onClose={resetContent} />;
      case 'repeatList': return <RepeatList onClose={resetContent} />;
      case 'help': return <Help onClose={resetContent} />;
      default: throw new Error('Unknown content type in book menu');
    }
  };

  const content = getContent(contentType);

  return useMemo(() => (
    <FadeContainer>
      {content}
    </FadeContainer>
  ), [contentType]);
};


MobileBookMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MobileBookMenu;
