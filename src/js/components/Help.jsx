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
          foreign languages
        </p>
      </ListItem>
      <ListItem name="How does this help learn a language?">
        <p className="helpText">
          Repeatio automatically shows translation of the selected
          word or sentance and allows you to save it and repeat it later.
        </p>
      </ListItem>
      <ListItem name="What book formats are supported?">
        <p className="helpText">
          Right now, only FB2 format is supported
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
