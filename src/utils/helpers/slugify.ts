import { generateRandomString } from '../helpers';

const slugify = (title: string, appendRandomString = false): string => {
  if (appendRandomString) {
    const randomString: string = generateRandomString(10);
    title = `${title} + ${randomString}`;
  }

  return title
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export default slugify;
