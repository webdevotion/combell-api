const randomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const concat = (values, delimiter) => values.join(delimiter);

const now = () => new Date();

const epoch = () =>
  // unix timestamp in seconds
  Math.floor(now() / 1000);


module.exports = {
  randomString, concat, now, epoch,
};
