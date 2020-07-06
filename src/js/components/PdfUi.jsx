import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Document, Page } from 'react-pdf/dist/entry.webpack';

import { SettingsContext } from './SettingsProvider';

import BookMenuWrapper from './BookMenuWrapper';
import PageCounter from './PageCounter';
import SelectionPopupArea from './SelectionPopupArea';

const PdfUi = ({
  source,
  onBookClose,
}) => {
  const [curPage, setCurPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);

  const getVGap = () => 20;

  const { fontSize } = useContext(SettingsContext);
  const getPageHeight = () => fontSize * 60;

  const pdfDocumentWrapperRef = useRef();

  const forcePageChange = (newCurPage) => {
    pdfDocumentWrapperRef.current.scrollTop = (
      (newCurPage - 1) * (getPageHeight() + getVGap())
    );
  };

  const updatePageNumber = () => {
    const { scrollTop } = document.querySelector(':root');
    const newPageNumberZeroBased = Math.floor(
      scrollTop / (getPageHeight() + getVGap())
    );
    setCurPage(newPageNumberZeroBased + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', updatePageNumber);
    return () => window.removeEventListener('scroll', updatePageNumber);
  });

  const handleLoadSuccess = (bookInfo) => {
    console.log(bookInfo);
    setTotalPages(bookInfo.numPages);
  };

  const handleLoadError = (error) => {
    console.log(error);
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

  const documentHeight = getVGap() + totalPages * (getPageHeight() + getVGap());

  return (
    <div className="pdfUi">
      <BookMenuWrapper onBookClose={onBookClose}>
        <div className="pageCounterContainer">
          <PageCounter
            curPage={curPage}
            totalPages={totalPages}
            onCurPageChange={forcePageChange}
          />
        </div>
      </BookMenuWrapper>
      <div className="pdfDocumentWrapper" ref={pdfDocumentWrapperRef}>
        <SelectionPopupArea>
          <Document
            file={source}
            onLoadSuccess={handleLoadSuccess}
            onLoadError={handleLoadError}
          >
            {renderPage(curPage - 1)}
            {renderPage(curPage)}
            {renderPage(curPage + 1)}
          </Document>
          <div
            className="documentPlaceholder"
            style={{ height: `${documentHeight}px` }}
          />
        </SelectionPopupArea>
      </div>
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
