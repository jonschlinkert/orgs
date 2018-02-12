# orgs [![NPM version](https://img.shields.io/npm/v/orgs.svg?style=flat)](https://www.npmjs.com/package/orgs) [![NPM monthly downloads](https://img.shields.io/npm/dm/orgs.svg?style=flat)](https://npmjs.org/package/orgs) [![NPM total downloads](https://img.shields.io/npm/dt/orgs.svg?style=flat)](https://npmjs.org/package/orgs) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/orgs.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/orgs)

> Get an organization from the GitHub API, or all organizations for one or more users.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save orgs
```

## Usage

```js
const orgs = require('orgs');
```

## API

**Params**

* `users` **{String|Array}**: One or more users or organization names.
* `options` **{Object}**
* `returns` **{Promise}**

**Example**

```js
const orgs = require('orgs');

// see github-base for other authentication options
orgs(['doowb', 'jonschlinkert'], { token: 'YOUR_GITHUB_AUTH_TOKEN' })
  .then(orgs => {
    // array of organization objects from the GitHub API
    console.log(orgs);
  })
  .catch(console.error)l
```

### [.get](index.js#L70)

Get publicly available information about the given GitHub `organization`. Equivalent to `GET /orgs/:orgname`.

**Params**

* `name` **{String}**: GitHub organization name.
* `options` **{Object}**
* `returns` **{object}**: Response object with information about the organization.

**Example**

```js
const orgs = require('orgs');
orgs.get('micromatch', { token: 'YOUR_GITHUB_AUTH_TOKEN' })
  .then(res => console.log(res))
  .catch(console.error);
```

### [.user](index.js#L88)

Get publicly available information about the given GitHub `user`. Equivalent to `GET /users/:username`.

**Params**

* `user` **{String}**: GitHub username.
* `options` **{Object}**
* `returns` **{object}**: Response object with array of orgs on `res.orgs`.

**Example**

```js
const orgs = require('orgs');
orgs.user('doowb', { token: 'YOUR_GITHUB_AUTH_TOKEN' })
  .then(res => console.log(res.orgs))
  .catch(console.error);
```

### [.users](index.js#L105)

Get publicly available information about all GitHub users. Equivalent to a paginated request to `GET /users`.

**Params**

* `options` **{Object}**
* `returns` **{object}**: Response object with array of orgs on `res.orgs`.

**Example**

```js
const orgs = require('orgs');
orgs.users({ token: 'YOUR_GITHUB_AUTH_TOKEN' })
  .then(res => console.log(res))
  .catch(console.error);
```

### [.userOrgs](index.js#L122)

Get an array of orgs for the given `user`. Equivalent to `GET /users/:username`.

**Params**

* `user` **{String}**
* `options` **{Object}**
* `returns` **{object}**: Response object with array of orgs on `res.orgs`.

**Example**

```js
const orgs = require('orgs');
orgs.userOrgs('doowb', { token: 'YOUR_GITHUB_AUTH_TOKEN' })
  .then(res => console.log(res))
  .catch(console.error);
```

### [.all](index.js#L144)

Get a list of objects with information for all publicly available GitHub organizations. Equivalent to a paginated request to `GET /organizations`.

**Params**

* `options` **{Object}**
* `returns` **{object}**: Response object with array of orgs on `res.orgs`.

**Example**

```js
const orgs = require('orgs');
orgs.all({ token: 'YOUR_GITHUB_AUTH_TOKEN' })
  .then(res => console.log(res))
  .catch(console.error);
```

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on August 14, 2018._