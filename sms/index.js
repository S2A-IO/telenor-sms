'use strict';

const Promise = require( 'bluebird' );
const env = process.env;
var request = require("request");
const xmlToJson = require('xml-to-json-stream');
const parser = xmlToJson({attributeMode:false});

/**
 * This function is the entry point for serverless function.
 *
 * @param {any} data                          Data passed to this function.
 * @param {any} context                       Client context. Unused.
 * @param {function} callback                 Callback function to pass back
 *                                            the response.
 *
 * @returns {undefined} None.
 */
module.exports.handler = function SendSMSHandler( data, context, callback ) {
  let msisdn = data.env.msisdn;
  let password = data.env.password;
  let to = data.current.to;
  let message = data.current.message;
  message = encodeURI(message);
  
  return sendSMS( msisdn, password, to, message )
  .then( function AfterSentSMS( result ) {
    callback( null, result );
  }).catch( function OnSMSError( error ) {
    callback( error, null );
  });
};

function sendSMS ( msisdn, password, to, message) {
  let p = new Promise((resolve, reject)=>{
    request('https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn='+msisdn+'&password='+password, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      if (error) return reject(error);
      try {
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the Success Body.
        resolve( body );
      } catch(e) {
        reject(e);
      }
    });
  });
  p.then(res=>{
    return new Promise((resolve, reject)=>{
      parser.xmlToJson(res, (error,json)=>{ // Parsing the session id response for future use in other API
        if (error) return reject(error);
        try {
          resolve(json.corpsms.data);
        } catch(e) {
          reject(e);
        }
      });
    });
  }).then(res=>{
    return new Promise((resolve, reject)=>{
     request('https://telenorcsms.com.pk:27677/corporate_sms2/api/sendsms.jsp?session_id='+res+'&to='+to+'&text='+message+'&mask=NAVTTC&unicode=true', function (error, response, body) {
       if (error) return reject(error);
       try {
         resolve(body);
       } catch(e) {
         reject(e);
       }
     });
    });
  });
  return p;
};

module.exports.handler( {}, {}, function( error, result ) {} );
