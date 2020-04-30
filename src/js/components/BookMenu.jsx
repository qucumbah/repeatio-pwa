import React from 'react';
import PropTypes from 'prop-types';

import MenuLink from './MenuLink';

import SettingsIcon from '../../img/settings.svg';
import RepeatListIcon from '../../img/book.svg';
import FaqIcon from '../../img/info.svg';

const BookMenu = ({ onClose }) => (
  <div className="overlayMenu bookMenu">
    <h2>BookMenu</h2>
    <ul className="list">
      <li>
        <MenuLink action={() => {}} icon={SettingsIcon}>Settings</MenuLink>
      </li>
      <li>
        <MenuLink action={() => {}} icon={RepeatListIcon}>Repeat list</MenuLink>
      </li>
      <li>
        <MenuLink action={() => {}} icon={FaqIcon}>Help</MenuLink>
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

BookMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default BookMenu;
