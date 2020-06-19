import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Document, Page } from 'react-pdf/dist/entry.webpack';

import { SettingsContext } from './SettingsProvider';

import BookMenuWrapper from './BookMenuWrapper';
import PageCounter from './PageCounter';

const PdfUi = ({
  source,
  onBookClose,
}) => {
  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);

  const getVGap = () => 20;

  const { fontSize } = useContext(SettingsContext);
  const getPageHeight = () => fontSize * 60;

  const documentRef = useRef();

  const forcePageChange = (newCurPage) => {
    if (!documentRef.current) {
      return;
    }

    documentRef.current.scrollTop = (
      (newCurPage - 1) * (getPageHeight() + getVGap())
    );
  };

  const updatePageNumber = () => {
    if (!documentRef.current) {
      return;
    }

    const { scrollTop } = documentRef.current;
    const newPageNumberZeroBased = Math.floor(
      scrollTop / (getPageHeight() + getVGap())
    );
    setCurPage(newPageNumberZeroBased + 1);
  };

  const handleLoadSuccess = (bookInfo) => {
    console.log(bookInfo);
    setTotalPages(bookInfo.numPages);
  };

  const handleLoadError = (error) => {
    console.log(error);
  };

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

  return (
    <div
      className="pdfUi"
      onScroll={updatePageNumber}
    >
      <BookMenuWrapper onBookClose={onBookClose}>
        <div className="pageCounterContainer">
          <PageCounter
            curPage={curPage}
            totalPages={totalPages}
            onCurPageChange={forcePageChange}
          />
        </div>
      </BookMenuWrapper>
      <Document
        file={source}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
        inputRef={(ref) => { documentRef.current = ref; }}
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
  // onBookInfoChange: PropTypes.func.isRequired,
};

PdfUi.defaultProps = {
  source: '',
};

export default PdfUi;
