// generates a base 64 hmac with given text and secret
export function hmacify(text, nonce) {
  return crypto.createHmac('sha256', nonce).update(text).digest('base64');
}
