const contexts = {
  general: {
    context: 'general_error',
  },
  request_setup: {
    context: 'request_setup_error',
  },
  no_response: {
    context: 'no_response_received',
  },
  auth_authorization_header_invalid_format: {
    context: 'authentication',
  },
  authorization_hmac_invalid: {
    context: 'hmac_authorization_header_invalid',
  },
};

const errorcontext = (error) => {
  const { status } = error.response;

  switch (status) {
    case 401:
      return contexts.auth_authorization_header_invalid_format.context;
    default:
      break;
  }

  let e = error.response.data.error_code;
  // not able to find an error code in axios response object
  if (!e) {
    // we have no clue what happened, throw general error
    return contexts.general.context;
  }

  // look up a more application centered error message
  e = contexts[e];
  // we haven't seen this before - throw general error
  if (!e) {
    return contexts.general.context;
  }

  // we have a clue what's going on and throw an error
  // which provides some application centric context
  // for example: 'authentication failed'
  return e.context;
};

// error is just axios' response object
export const errorhandler = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(error.request.headers)
    // console.log(error.response.status)
    // console.log(error.response.headers)
    const context = errorcontext(error);
    return new Error(context);
  } else if (error.request) {
    // The request was made but no response w2as received
    // `error.request` is an instance of XMLHttpRequest in the browser
    // and an instance of http.ClientRequest in node.js
    return new Error(contexts.no_response.context);
  }

  return new Error(contexts.general.context);
}
