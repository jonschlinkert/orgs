'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth.js');
const orgs = require('../');

describe('orgs', function() {
  this.timeout(10000);

  describe('main export', function() {
    it('should catch error when invalid args are passed', () => {
      return orgs().catch(err => assert(err));
    });

    it('should catch error when bad credentials are passed', () => {
      return orgs('micromatch', { token: 'foo' })
        .catch(err => {
          assert.equal(err.message, 'Bad credentials');
        });
    });

    it('should get the specified org', () => {
      return orgs('micromatch', auth)
        .then(res => {
          assert(Array.isArray(res));
          assert.equal(res.length, 1);
        });
    });

    it('should get an array of orgs', () => {
      return orgs(['micromatch', 'breakdance'], auth)
        .then(res => {
          assert(Array.isArray(res));
          assert.equal(res.length, 2);
        });
    });
  });

  describe('.get', () => {
    it('should get the specified org', () => {
      return orgs.get('micromatch', auth)
        .then(res => {
          assert(res.body);
          assert(res.body.login, 'micromatch');
        });
    });
  });

  describe('.user', () => {
    it('should get the specified user', () => {
      return orgs.user('doowb', auth)
        .then(res => {
          assert(res.body);
          assert(res.body.login, 'doowb');
        });
    });
  });

  describe('.userOrgs', () => {
    it('should get the list of orgs for the specified user', () => {
      return orgs.userOrgs('doowb', auth)
        .then(res => {
          assert(Array.isArray(res.orgs));
        });
    });
  });
});
