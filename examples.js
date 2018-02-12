const orgs = require('./');

orgs(['micromatch', 'jonschlinkert', 'node'], require('./test/support/auth'))
  .then(results => {
    for (const ele of results) {
      console.log(ele.login);
      if (!ele.login) {
        console.log(ele);
      }
    }
  })
  .catch(err => console.log(err));
