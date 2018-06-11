import { account } from './lib/combell'

// example usage:
// call index() to fetch all your accounts
// index() returns a promise
// errors from making the call are thrown and catched inside the library
// custom error handling / error bubbling is considered for a future update
account.index().then(result => console.log(result))
