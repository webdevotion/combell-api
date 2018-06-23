import { createHmac } from "crypto";

// generates a base 64 hmac with given text and secret
export function hmacify(text, secret) {
  return createHmac('sha256', secret).update(text).digest('base64');
}
