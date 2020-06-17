import React, { useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { SettingsContext } from './SettingsProvider';

const PdfUi = ({
  source,
  onBookClose,
  onBookInfoChange,
}) => {
  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);

  const handleLoadSuccess = (bookInfo) => {
    setTotalPages(bookInfo.numPages);
    bookInfo.getMetadata().then(({ info }) => {
      onBookInfoChange({ title: info.Title });
    });
  };

  const handleLoadError = (error) => {
    console.log(error);
  };

  const getVGap = () => 20;

  const { fontSize } = useContext(SettingsContext);
  const getPageHeight = () => fontSize * 60;

  const bookPlaceholderStyle = {
    height: `${getVGap() + totalPages * (getPageHeight() + getVGap())}px`,
  };

  const renderPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return null;
    }

    const pageCountainerStyle = {
      top: `${getVGap() + (pageNumber - 1) * (getPageHeight() + getVGap())}px`,
    };

    return (
      <div className="pdfPageContainer" style={pageCountainerStyle}>
        <Page height={getPageHeight()} pageNumber={pageNumber} />
      </div>
    );
  };

  const documentRef = useRef();
  const updatePageNumber = () => {
    const { scrollTop } = documentRef.current;
    const newPageNumberZeroBased = Math.floor(
      scrollTop / (getPageHeight() + getVGap())
    );
    setCurPage(newPageNumberZeroBased + 1);
  };

  return (
    <div
      className="pdfUi"
      onScroll={updatePageNumber}
    >
      <Document
        file={source}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
        inputRef={documentRef}
      >
        {renderPage(curPage - 1)}
        {renderPage(curPage)}
        {renderPage(curPage + 1)}
        <div className="bookPlaceholder" style={bookPlaceholderStyle} />
      </Document>
    </div>
  );
};

PdfUi.propTypes = {
  source: PropTypes.instanceOf(ArrayBuffer),
  onBookClose: PropTypes.func.isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
};

PdfUi.defaultProps = {
  source: '',
};

export default PdfUi;
