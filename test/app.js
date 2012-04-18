/**
 * Module dependencies.
 */
 
var express = require('express')
    ,app = module.exports = express.createServer()
    ,utils = require('./utils')
    ,config = require('./settings')
    , gservices = require('../lib/gservices');

// everyauth configurations for password login
var everyauth = require('everyauth');
everyauth.debug = true;
everyauth.everymodule.moduleTimeout(-1); // to turn off timeouts

everyauth
    .google
    .appId(config.google.clientId)
    .appSecret(config.google.clientSecret)
    .scope(config.google.scope)
    .handleAuthCallbackError( function (req, res) {
        res.header('Content-Type', 'text/html');
        res.write('<script>');
        res.write('alert(\"Google authentication is failed.\nPlease try again.\");');
        res.write('window.close();');
        res.end('</script>');
     })
    .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
        googleUser.refreshToken = extra.refresh_token;
        googleUser.expiresIn = extra.expires_in;
        return googleUser;
    })
    .addToSession( function (sess, auth) {
        var _auth = sess.auth || (sess.auth = {})
            , mod = _auth[this.name] || (_auth[this.name] = {});
        mod.oauthUser = auth.oauthUser;
        mod.googleUser = auth.googleUser;
        mod.accessToken = auth.accessToken;
        
        // test for google cloud print module
        var print = new gservices.CloudPrint(auth.accessToken);
        // search all printers
        print.search(null, function(data) {
            //console.log(data);
            var info = JSON.parse(data);
            if (info["success"]) {
                console.log('search ok');
                var printers = info.printers;
                if (printers.length == 0) {
                    // no printers here, quit testing
                    return;
                }
                // get printer info
                print.printer(printers[0].id, function(data) {
                    //console.log(data);
                    var info = JSON.parse(data);
                    if (info["success"]) {
                        console.log('printer ok');
                    } else {
                        console.log('printer failed');
                    }
                });
                
                // submit a job
                print.submit(printers[0].id
                            , 'title', '', 'test print job', 'test print job', 'tag'
                            , function(data) {
                    //console.log(data);
                    var info = JSON.parse(data);
                    if (info["success"]) {
                        console.log('submit ok');
                    } else {
                        console.log('submit failed');
                    }
                });
                
                // get job list
                print.jobs(printers[0].id, function(data) {
                    //console.log(data);
                    var info = JSON.parse(data);
                    if (info["success"]) {
                        console.log('jobs ok');
                        var jobs = info.jobs;
                        
                        if (jobs.length == 0) {
                            // no jobs here, quit testing
                            return;
                        }
                        
                        // delete a job
                        print.deletejob(jobs[0].id, function(data) {
                            //console.log(data);
                            var info = JSON.parse(data);
                            if (info["success"]) {
                                console.log('deletejob ok');
                            } else {
                                console.log('deletejob failed');
                            }
                        });
                    } else {
                        console.log('jobs failed');
                    }
                });
            } else {
                console.log('search failed');
            }
        });
    })
    .sendResponse( function (res) {
        res.header('Content-Type', 'text/html');
        res.write('<script>');
        res.write('alert(\"Google authentication is successed\");');
        res.write('window.close();');
        res.end('</script>');
    });

// Configuration
app.configure(function ()
{
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
        secret : 'secret'
    }));
    app.use(everyauth.middleware());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
}
);

app.configure('production', function ()
{
	app.use(express.errorHandler());
}
);

// main server
app.listen(3000);
console.log("goto http://localhost:3000/auth/google for testing");
