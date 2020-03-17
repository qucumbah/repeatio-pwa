class XMLParsingError extends Error { }

const isValidTagName = (tagName) => {
  if (tagName.length === 0) {
    return false;
  }
  const match = tagName.match(/(?![0-9 ])[^ \t\n]*/i);
  return match && match[0].length === tagName.length;
};

const isOnlyWhitespace = (source) => source.trim().length === 0;

const findNextTag = (source, startIndex) => {
  const start = source.indexOf('<', startIndex);
  const end = source.indexOf('>', startIndex);
  if (start === -1 && end === -1) {
    return null;
  }

  if (start === -1 && end !== -1) {
    throw new XMLParsingError("Found tag end but couldn't find it's start");
  }
  if (start !== -1 && end === -1) {
    throw new XMLParsingError("Found tag start but couldn't find it's end");
  }

  if (end < start) {
    throw new XMLParsingError(`End of tag (${end}) before tag start (${start})`);
  }

  const insideTag = source.slice(start + 1, end);

  if (insideTag.length === 0) {
    throw new XMLParsingError(`Empty tag found at ${startIndex}`);
  }

  const isProlog = (
    (insideTag[0] === '?') && (insideTag[insideTag.length - 1] === '?')
  );

  const slashIndexLeft = insideTag.indexOf('/');
  const isClosingOtherTag = slashIndexLeft === 0;
  const slashIndexRight = insideTag.lastIndexOf('/');
  const isSelfClosing = slashIndexRight === insideTag.length - 1 || isProlog;

  if (isClosingOtherTag && isSelfClosing) {
    throw new XMLParsingError(`Invalid tag format: <${insideTag}>`);
  }

  const isClosing = isClosingOtherTag || isSelfClosing;

  let insideTagTrimmed;
  if (isProlog) {
    insideTagTrimmed = insideTag.slice(1, insideTag.length - 1);
  } else if (!isClosing) {
    insideTagTrimmed = insideTag;
  } else if (isSelfClosing) {
    insideTagTrimmed = insideTag.slice(0, insideTag.length - 1);
  } else if (isClosingOtherTag) {
    insideTagTrimmed = insideTag.slice(1);
  }

  const firstSpaceIndex = insideTagTrimmed.indexOf(' ');
  const canHaveAttributes = firstSpaceIndex !== -1;

  const tagName = canHaveAttributes
    ? insideTagTrimmed.slice(0, firstSpaceIndex)
    : insideTagTrimmed;

  if (!isValidTagName(tagName)) {
    throw new XMLParsingError(`Tag name has invalid format: <${insideTag}>`);
  }

  const attributesString = insideTagTrimmed.slice(firstSpaceIndex + 1);
  if (!canHaveAttributes || isOnlyWhitespace(attributesString)) {
    return {
      start,
      end,
      isClosing,
      isSelfClosing,
      isClosingOtherTag,
      attributes: {},
      children: [],
      isRoot: false,
      name: tagName,
    };
  }

  const tokens = attributesString.trim().match(/[^ \t\n]*=["'][^"]*["']/ig);
  const attributes = {};
  tokens.forEach((token) => {
    const equalsSignIndex = token.indexOf('=');
    const attributeName = token.slice(0, equalsSignIndex);
    const attributeValue = token.slice(equalsSignIndex + 2, -1);
    attributes[attributeName] = attributeValue;
  });

  return {
    start,
    end,
    isClosing,
    isSelfClosing,
    isClosingOtherTag,
    attributes,
    children: [],
    isRoot: false,
    name: tagName,
  };
};

const parseXML = (source) => {
  const result = {
    name: 'root',
    parent: null,
    attributes: null,
    start: -1,
    end: -1,
    children: [],
    isRoot: true,
  };

  let curTag = result;
  let startIndex = 0;

  while (startIndex < source.length) {
    const nextTag = findNextTag(source, startIndex);

    if (nextTag === null) {
      if (!curTag.isRoot) {
        throw new XMLParsingError(`Couldn't find closing tag for tag "${curTag.name}" starting at position ${curTag.start}`);
      }

      const leftovers = source.slice(startIndex);
      if (!isOnlyWhitespace(leftovers)) {
        curTag.children.push(leftovers);
      }
      break;
    }

    const contentBetween = source.slice(startIndex, nextTag.start);
    if (!isOnlyWhitespace(contentBetween)) {
      curTag.children.push(contentBetween);
    }

    nextTag.parent = curTag;

    if (nextTag.isSelfClosing) {
      curTag.children.push(nextTag);
    } else if (nextTag.isClosing) {
      if (nextTag.name !== curTag.name) {
        throw new XMLParsingError(`Opening (${curTag.name}) and closing (${nextTag.name}) tag mismatch`);
      }

      curTag = curTag.parent;
    } else {
      curTag.children.push(nextTag);
      curTag = nextTag;
    }

    startIndex = nextTag.end + 1;
  }

  return result;
};

// eslint-disable-next-line import/prefer-default-export
export { parseXML };
