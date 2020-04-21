import React from 'react';
import PropTypes from 'prop-types';

const MenuLink = ({ icon, action, children }) => (
  <button type="button" className="menuLink" onClick={action}>
    {icon !== '' && <img src={icon} alt={children} />}
    {children !== null && <div className="text">{children}</div>}
  </button>
);

MenuLink.propTypes = {
  icon: PropTypes.string,
  action: PropTypes.func,
  children: PropTypes.node,
};

MenuLink.defaultProps = {
  icon: '',
  action: null,
  children: null,
};

export default MenuLink;
