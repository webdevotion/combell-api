import * as chai from 'chai';
import rewire from 'rewire';

const { expect } = chai;

const subject = rewire('../../../lib/core/response');

describe('Response', () => {
  describe('test error context handling', () => {
    it('should error handle http status 401', async () => {
      const response = {
        response: {
          status: 401,
        },
      };

      const err = new Error('authentication');
      const test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message', err.message);
    });

    it('should error handle empty status and empty error_code', async () => {
      const response = {
        response: {
          status: null,
          data: {
            error_code: null,
          },
        },
      };

      const err = new Error('general_error');
      const test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message', err.message);
    });

    it('should error handle empty status and an error_code property', async () => {
      const response = {
        response: {
          status: null,
          data: {
            error_code: 'general',
          },
        },
      };

      let err = new Error('general_error');
      let test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message', err.message);

      response.response.data.error_code = 'xxx_unknown_error_code_xxx';
      err = new Error('general_error');
      test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message', err.message);
    });

    it('should error handle an empty response property', async () => {
      const response = {
        request: { empty: 'object' },
      };

      const err = new Error('no_response_received');
      const test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message', err.message);
    });

    it('should error handle all other cases', async () => {
      const response = {
        request: null,
        response: null,
      };

      const err = new Error('general_error');
      const test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message', err.message);
    });
  });
});
