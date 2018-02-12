'use strict';

const GitHub = require('github-base');
const github = (method, url, options) => new GitHub(options)[method](url);

/**
 * Get publicly available information from the GitHub API for one or
 * more users or organizations. If user names are passed, all orgs for those
 * users are returned. If organization names are passed, an object is
 * returned with information about each org.
 *
 * ```js
 * const orgs = require('orgs');
 *
 * // see github-base for other authentication options
 * orgs(['doowb', 'jonschlinkert'], { token: 'YOUR_GITHUB_AUTH_TOKEN' })
 *   .then(orgs => {
 *     // array of organization objects from the GitHub API
 *     console.log(orgs);
 *   })
 *   .catch(console.error)l
 * ```
 * @param {String|Array} `users` One or more users or organization names.
 * @param {Object} `options`
 * @return {Promise}
 * @api public
 */

async function orgs(users, options) {
  const opts = Object.assign({}, options);
  const acc = { orgs: [], names: [] };

  if (isObject(users)) {
    return github('paged', '/user/orgs', users).then(res => addOrgs(acc, res));
  }

  if (typeof users === 'string') users = [users];
  if (!Array.isArray(users)) {
    return Promise.reject(new TypeError('expected users to be a string or array'));
  }

  const pending = [];
  for (const name of users) {
    pending.push(getOrgs(acc, name, options));
  }

  await Promise.all(pending);

  if (opts.sort !== false) {
    return acc.orgs.sort(compare('login'));
  }
  return acc.orgs;
}

/**
 * Get publicly available information about the given GitHub `organization`.
 * Equivalent to `GET /orgs/:orgname`.
 *
 * ```js
 * const orgs = require('orgs');
 * orgs.get('micromatch', { token: 'YOUR_GITHUB_AUTH_TOKEN' })
 *   .then(res => console.log(res))
 *   .catch(console.error);
 * ```
 * @param {String} `name` GitHub organization name.
 * @param {Object} `options`
 * @return {object} Response object with information about the organization.
 * @api public
 */

orgs.get = (name, options) => github('get', `/orgs/${name}`, options);

/**
 * Get publicly available information about the given GitHub `user`.
 * Equivalent to `GET /users/:username`.
 *
 * ```js
 * const orgs = require('orgs');
 * orgs.user('doowb', { token: 'YOUR_GITHUB_AUTH_TOKEN' })
 *   .then(res => console.log(res.orgs))
 *   .catch(console.error);
 * ```
 * @param {String} `user` GitHub username.
 * @param {Object} `options`
 * @return {object} Response object with array of orgs on `res.orgs`.
 * @api public
 */

orgs.user = (name, options) => github('get', `/users/${name}`, options);

/**
 * Get publicly available information about all GitHub users.
 * Equivalent to a paginated request to `GET /users`.
 *
 * ```js
 * const orgs = require('orgs');
 * orgs.users({ token: 'YOUR_GITHUB_AUTH_TOKEN' })
 *   .then(res => console.log(res))
 *   .catch(console.error);
 * ```
 * @param {Object} `options`
 * @return {object} Response object with array of orgs on `res.orgs`.
 * @api public
 */

orgs.users = options => github('paged', '/users', options);

/**
 * Get an array of orgs for the given `user`. Equivalent to `GET /users/:username`.
 *
 * ```js
 * const orgs = require('orgs');
 * orgs.userOrgs('doowb', { token: 'YOUR_GITHUB_AUTH_TOKEN' })
 *   .then(res => console.log(res))
 *   .catch(console.error);
 * ```
 * @param {String} `user`
 * @param {Object} `options`
 * @return {object} Response object with array of orgs on `res.orgs`.
 * @api public
 */

orgs.userOrgs = (user, options) => {
  return github('paged', `/users/${user}/orgs`, options).then(reduce);
};

/**
 * Get a list of objects with information for all publicly available GitHub organizations.
 * Equivalent to a paginated request to `GET /organizations`.
 *
 * ```js
 * const orgs = require('orgs');
 * orgs.all({ token: 'YOUR_GITHUB_AUTH_TOKEN' })
 *   .then(res => console.log(res))
 *   .catch(console.error);
 * ```
 * @param {Object} `options`
 * @return {object} Response object with array of orgs on `res.orgs`.
 * @api public
 */

orgs.all = options => {
  return github('paged', '/organizations', options).then(reduce);
};

/**
 * Helpers
 */

async function getOrgs(acc, name, options) {
  let res = await orgs.user(name, options);
  let data = res.body || res.data;
  if (data.type === 'User') {
    addOrgs(acc, data);
    return orgs.userOrgs(name, options).then(res => {
      addOrgs(acc, res.orgs);
      return res;
    });
  }
  return addOrgs(acc, data);
}

function addOrgs(acc, org) {
  if (Array.isArray(org)) {
    org.forEach(o => addOrgs(acc, o));
    return acc;
  }

  if (org.pages) {
    for (const page of org.pages) {
      let data = page.body || page.data;
      for (const obj of data) {
        obj.type = 'Organization';
        addOrgs(acc, obj);
      }
    }
    return acc;
  }

  const idx = acc.names.indexOf(org.login);
  org.name = org.name || org.login;

  if (idx === -1) {
    acc.names.push(org.login);
    acc.orgs.push(org);
  } else if (org.type) {
    acc.names[idx] = org.login;
    acc.orgs[idx] = org;
  }
  return acc;
}

function reduce(res) {
  res.orgs = res.pages.reduce((acc, page) => acc.concat(page.body), []);
  return res;
}

function compare(prop) {
  return (a, b) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] > b[prop]) return 1;
    return 0;
  };
}

function isObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Expose `orgs`
 */

module.exports = orgs;
