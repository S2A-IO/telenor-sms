const smsNotification = require('./../sms/index');
var assert = require('assert');
let correctParams = {};
let incorrectParams = {};
let context = '';
let status = false;
// Please change the parameters with valid values and parameters to run the test case
correctParams.env = {
  accountSid: 'xxxxxxxxx',
  authToken: 'xxxxxxxxxx'
};
// Please change the parameters with valid values and parameters to run the test case
correctParams.current = {
  to : '+923315572435',
  from : '+14103046211',
  message : 'Hello'
};

describe('sms notification with correct params', function () {
  it('sms notification with correct params', function (done) {
    smsNotification.handler(correctParams, context, function testHandler ( error, res) {
      if ( error ) {
        console.log('error',error);
      }
      if ( res ) {
        console.log('res',res);
      }
    });
  })
})
