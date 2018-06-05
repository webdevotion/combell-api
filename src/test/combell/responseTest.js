import * as chai from 'chai';
import nock from 'nock';
import rewire from 'rewire';

const { expect } = chai;

const subject = rewire('../../combell/response');

describe('Response', () => {
  describe('test error context handling', () => {
    it('should error handle http status 401', async () => {
      let response = {
        'response': {
          'status': 401
        }
      }

      let err = new Error('authentication');
      let test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message',err.message);
    });

    it('should error handle empty status and empty error_code', async () => {
      let response = {
        'response': {
          'status': null,
          'data': {
            'error_code': null
          }
        }
      }

      let err = new Error('general_error');
      let test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message',err.message);
    });

    it('should error handle empty status and an error_code property', async () => {
      let response = {
        'response': {
          'status': null,
          'data': {
            'error_code': 'general'
          }
        }
      }

      var err = new Error('general_error');
      var test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message',err.message);

      response.response.data.error_code = 'xxx_unknown_error_code_xxx';
      err = new Error('general_error');
      test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message',err.message);
    });

    it('should error handle an empty response property', async () => {
      let response = {
        'request': {'empty':'object'}
      }

      let err = new Error('no_response_received');
      let test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message',err.message);
    });

    it('should error handle all other cases', async () => {
      let response = {
        'request': null,
        'response': null
      }

      let err = new Error('general_error');
      let test = subject.errorhandler(response);
      expect(test).to.exist
        .and.to.be.a('Error')
        .and.have.property('message',err.message);
    });
  });
});
