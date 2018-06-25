export function randomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function concat (values, delimiter) {
  return values.join(delimiter);
}

export function now() {
  return new Date();
}

export function epoch() {
  // unix timestamp in seconds
  return Math.floor(now() / 1000);
}
