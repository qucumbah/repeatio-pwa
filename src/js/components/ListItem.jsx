import React from 'react';
import PropTypes from 'prop-types';

const ListItem = ({ name, children }) => (
  <li className="listItem">
    <span className="name">{name}</span>
    <div className="content">{children}</div>
  </li>
);

ListItem.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ListItem;
