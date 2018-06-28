// production apps should never use dotenv to load secrets
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import Combell from '../../lib/combell.js';

const dumpError = (err) => {
  if (typeof err === 'object') {
    if (err.message) {
      console.log('\nMessage: ' + err.message)
    }
    if (err.stack) {
      console.log('\nStacktrace:')
      console.log('====================')
      console.log(err.stack);
      console.log('====================\n');
    }
  } else {
    console.log('dumpError :: argument is not an object');
  }
}

const getAccountWithNonExistingID = () => {
  // let's fail on purpose by requesting information of Account with id 1
  // Combell's API returns 404 when the record is not found
  // When requesting id 0 the API returns all accounts without filtering on id
  let failOnPurpose = combell.getAccount(1);
  failOnPurpose.catch(dumpError);
}

let key     = process.env.COMBELL_API_KEY;
let secret  = process.env.COMBELL_API_SECRET;

let combell = new Combell(key,secret);
// get /v2/accounts, which might throw, or return an array of 'account' objects

let account = combell.getAccounts()
  .then(result => result.data)
  .then(accounts => {
    // pick the first element, get the id
    let id = accounts[0].id;
    // ask the API for the account with this id
    return combell.getAccount(id);
  })
  .then(result => result.data)
  .catch(dumpError);

// let's get the first account 
// and print the object that is returned from the API
account
  .then( a => {
    console.log('\n====================\n');
    console.log(a);
    console.log('\n====================\n');
    getAccountWithNonExistingID();
  })
  .catch(dumpError);


module.exports = {};
