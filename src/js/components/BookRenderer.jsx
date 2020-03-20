import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Cheerio from 'cheerio';

const BookRenderer = (props) => {
  const {
    source,
    onContentWidthChange,
    onContainerWidthChange,
    offset,
  } = props;

  const containerRef = useRef();
  useEffect(() => {
    onContainerWidthChange(containerRef.current.clientWidth);
  }, [containerRef.current ? containerRef.current.clientWidth : null]);

  const contentRef = useRef();
  useEffect(() => {
    onContentWidthChange(contentRef.current.clientWidth);
  }, [contentRef.current ? contentRef.current.clientWidth : null]);

  const $ = Cheerio.load(source, { xmlMode: true });
  const dom = new DOMParser().parseFromString(source, 'text/xml');
  // console.log(dom);

  useEffect(() => {
    containerRef.current.scrollLeft = offset;
  }, [offset]);

  return (
    <div className="bookRendererContainer" ref={containerRef}>
      <div className="bookRendererContent" ref={contentRef}>
        {dom.getElementsByTagName('body')[0].innerHTML}
      </div>
    </div>
  );
};

BookRenderer.propTypes = {
  source: PropTypes.string.isRequired,
  onContentWidthChange: PropTypes.func.isRequired,
  onContainerWidthChange: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};

export default BookRenderer;
