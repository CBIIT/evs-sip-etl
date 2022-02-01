// Characters to include, along with their inclusive ASCII ranges
const charset = {
  digits: {
    start: 48,
    end: 57,
  },
  uppercase: {
    start: 65,
    end: 90,
  },
  lowercase: {
    start: 97,
    end: 122,
  },
};

// How long nanoid's should be
const length = 6;

// Generate a string of all included characters
const chars = Object.keys(charset).reduce((charAcc, charTypeName) => {
  const charType = charset[charTypeName];
  const start = charType.start;
  const end = charType.end;

  // Pick up ASCII characters
  for (let i = start; i <= end; i++) {
    const c = String.fromCharCode(i);
    charAcc = charAcc.concat(c);
  }

  return charAcc;
}, '');

/**
 * Generates a random 6-character alphanumeric string
 */
const generateNanoId = () => {
  let nanoId = '';
  
  // Fill array with random characters
  for (let i = 0; i < length; i++) {
    let randIndex = Math.floor(Math.random() * chars.length);

    nanoId = nanoId.concat(chars[randIndex]);
  }

  return nanoId;
};

export default generateNanoId;
