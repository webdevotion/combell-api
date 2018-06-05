const randomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i = i+1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const concat = (values, delimiter) => {
  return values.join(delimiter);
}

const now = () => {
  return new Date();
}

const epoch = () => {
  // unix timestamp in seconds
  return Math.floor(now() / 1000);
}


module.exports = {
  randomString, concat, now, epoch,
};
