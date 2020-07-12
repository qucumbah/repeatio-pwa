import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const Help = ({ onClose }) => (
  <div className="overlayMenu help">
    <h2>Help</h2>
    <ol className="list">
      <ListItem name="What is this?">
        <p className="helpText">
          Repeatio is a customizable book reader for people who are learning
          foreign languages.
        </p>
      </ListItem>
      <ListItem name="What exactly is customizable?">
        <p className="helpText">
          You can change the primary color of the UI, dark mode, and font size.
        </p>
      </ListItem>
      <ListItem name="How does this help to learn a language?">
        <p className="helpText">
          Repeat automatically shows translations of the selected word or
          sentence.
        </p>
      </ListItem>
      <ListItem name="Which book formats are supported?">
        <p className="helpText">
          FB2 and PDF, you can use the translation feature in both (if the book
          quality allows it).
        </p>
      </ListItem>
    </ol>
    <button
      className="closeButton"
      type="button"
      aria-label="close"
      onClick={onClose}
    />
  </div>
);

Help.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Help;
