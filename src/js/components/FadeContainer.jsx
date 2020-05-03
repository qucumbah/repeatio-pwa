import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FadeContainer = ({ fadeDuration, children }) => {
  const [curChildren, setCurChildren] = useState(children);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (curChildren === null) {
      setCurChildren(children);
      return;
    }

    setOpacity(0);
    setTimeout(() => {
      setCurChildren(children);
      setOpacity(1);
    }, fadeDuration);
  }, [children]);

  const style = {
    transition: `opacity ${fadeDuration}ms ease`,
    opacity: `${opacity}`,
  };

  return <div className="fadeContainer" style={style}>{curChildren}</div>;
};

FadeContainer.propTypes = {
  fadeDuration: PropTypes.number,
  children: PropTypes.node.isRequired,
};

FadeContainer.defaultProps = {
  fadeDuration: 200,
};

export default FadeContainer;
