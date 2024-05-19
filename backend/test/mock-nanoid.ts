let count = 0;
const shortUrl = 'abcdef';

jest.mock('nanoid', () => {
  return {
    nanoid: () => `${shortUrl}${++count}`,
  };
});
