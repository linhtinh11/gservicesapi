Google services api for nodejs
(current version supports google cloud print only, pull request to me if you need others and welcome if you want to contribute to this respository)
===

### To use in nodejs

var gservices = require('gservices');
...
// auth.google.accessToken that you got in google authentication oauth2 (see everyauth for example)
var print = new gservices.CloudPrint(auth.google.accessToken);
...
// list of printers
print.search(null, function(data) {
                console.log(data);
            }
);
// submit a job
print.submit('printerID'
            , 'title'
            , ''
            , 'test print job'
            , 'test print job'
            , 'tag'
            , function(data) {
                console.log(data);
            }
);

### To run the tests:

cd ./test
node app.js
This text will be displayed in your console, follow it:
"goto http://localhost:3000/auth/google for testing"
note: testing required express and everyauth

Resources for Newcomers
---
  - https://www.google.com/cloudprint/learn/
  - https://developers.google.com/cloud-print/?hl=en
  