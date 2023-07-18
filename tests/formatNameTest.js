import formatName from '../src/lib/formatName.js';

const tests = {
  'Null': {
    input: null,
    solution: null,
  },
  'Empty string': {
    input: '',
    solution: '',
  },
  'Non-string': {
    input: 69,
    solution: 69,
  },
  'Full string': {
    input: '123/\\SolUtIon  \\*_/   String%,^',
    solution: '_solution_string_',
  },
};

const formatNameTest = () => {
  for (const test in tests) {
    const formattedName = formatName(tests[test].input);

    if (formattedName !== tests[test].solution) {
      console.log(`formatName() failed the ${test} test!`);
      console.log(`  ${tests[test].input} should be formatted as ${tests[test].solution}, but was instead formatted as ${formattedName}`);
    } else {
      console.log(`formatName() passed the ${test} test.`);
    }
  }
};

export default formatNameTest;