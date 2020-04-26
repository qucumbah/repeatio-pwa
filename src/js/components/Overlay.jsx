import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Overlay = ({ shouldOpen, from, children }) => {
  const [transitionDuration, setTransitionDuration] = useState(0);
  const [openingPosition, setOpeningPosition] = useState({ x: -1, y: -1 });
  const [isOpen, setIsOpen] = useState(false);

  const { x, y } = openingPosition;
  const circleRadius = (
    Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
  );
  const style = {
    transition: `clip-path ${transitionDuration}ms ease-in`,
    clipPath: `circle(${isOpen ? circleRadius : 0}px at ${x}px ${y}px)`,
  };

  const unwrapOverlay = () => {
    setTransitionDuration(750);
    setIsOpen(shouldOpen);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      setTransitionDuration(0);
      if (from !== null) {
        setOpeningPosition(from);
      }
      requestAnimationFrame(unwrapOverlay);
    });
  }, [shouldOpen, from]);

  return <div className="overlay" style={style}>{children}</div>;
};

Overlay.propTypes = {
  shouldOpen: PropTypes.bool.isRequired,
  from: PropTypes.exact({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  children: PropTypes.node.isRequired,
};

Overlay.defaultProps = {
  from: null,
};

export default Overlay;
