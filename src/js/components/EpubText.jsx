import React from 'react';
import PropTypes from 'prop-types';
import Cheerio from 'cheerio';

const EpubText = React.memo(
  React.forwardRef((props, ref) => {
    const { source, onBookInfoChange } = props;

    const bufferDecoder = new TextDecoder('utf-8');
    const get$ = (filePath) => {
      const fileBuffer = source.get(filePath);
      const fileString = bufferDecoder.decode(fileBuffer);
      return Cheerio.load(fileString, { xmlMode: true });
    };

    const $ofContainer = get$('META-INF/container.xml');

    const convertRootFileToHtml = (rootFilePath) => {
      const $ofRootFile = get$(rootFilePath);
    };

    const content = Array.from($ofContainer('rootfile')).map((rootFileInfo) => {
      const rootFilePath = rootFileInfo.attribs['full-path'];

      return convertRootFileToHtml(rootFilePath);
    });

    return (
      <div className="epubText" ref={ref}>
        {content}
      </div>
    );
  })
);

EpubText.propTypes = {
  source: PropTypes.instanceOf(Map).isRequired,
  onBookInfoChange: PropTypes.func.isRequired,
};

export default EpubText;
