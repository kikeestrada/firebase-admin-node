import * as admin from '../../lib/index'

var chalk = require('chalk');
var _ = require('lodash');


let serviceAccount: any;
export let databaseUrl: string;
let storageBucket: string;
let projectId: string;

export let defaultApp: admin.app.App;
export let nullApp: admin.app.App;
export let nonNullApp: admin.app.App;

before(function() {
  console.log('global setup');
  try {
    serviceAccount = require('../resources/key.json');
  } catch(error) {
    console.log(chalk.red(
      'The integration test suite requires a service account key JSON file for a ' +
      'Firebase project to be saved to `test/resources/key.json`.',
      error
    ));
    throw error;
  }

  projectId = serviceAccount.project_id;
  databaseUrl = 'https://' + projectId + '.firebaseio.com';

  defaultApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseUrl,
    storageBucket: storageBucket,
  });
  
  nullApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseUrl,
    databaseAuthVariableOverride: null,
    storageBucket: storageBucket,
  }, 'null');
  
  nonNullApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseUrl,
    databaseAuthVariableOverride: {
      uid: generateRandomString(20),
    },
    storageBucket: storageBucket,
  }, 'nonNull');
});

after(function() {
  console.log('global teardown');
});

/**
 * Generate a random string of the specified length, optionally using the specified alphabet.
 *
 * @param {number} length The length of the string to generate.
 * @return {string} A random string of the provided length.
 */
function generateRandomString(length) {
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var text = '';
  for (var i = 0; i < length; i++) {
    text += alphabet.charAt(_.random(alphabet.length - 1));
  }
  return text;
}
