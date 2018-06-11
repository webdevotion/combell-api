import * as authorization from './core/authorization.js'
import * as accounts from './core/accounts'

// waiting for a future implementation where we can
// for example warn the user about this issue by logging
// or by invoking an error handler
const errors = async (e) => {
  switch (e.message) {
    case 'authentication':
      break;
    default:
      break;
  }
};

// returns empty array if catching an error
// thrown by the accounts module
const getAccounts = async () => {
  try {
    return await accounts.index(authorization);
  } catch (e) {
    // send thrown error to handler to properly tackle the issue
    errors(e);
    // user gets an empty array of accounts from us
    return [];
  }
};

export const account = {
  index: getAccounts
}

export default { account }
