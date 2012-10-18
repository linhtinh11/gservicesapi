var rest = require('restler');
var tokenURL = 'https://accounts.google.com/o/oauth2/token';
var gservices = exports;

gservices.CloudPrint = require('./cloudprint').CloudPrint;

gservices.refreshAccessToken = function(clientId, clientSecret, refreshToken, callback) {
	var url = tokenURL;
    var opts = {};
    
    opts.headers = {
    };
    
    opts.data = {
		client_id : clientId,
		client_secret : clientSecret,
		refresh_token : refreshToken,
		grant_type : 'refresh_token'
    };

    rest['post'](url, opts)
        .on('complete', function (data, res) {
			// console.log('oncomplete, res:' + res.statusCode);
            callback(data);
        });
}

gservices.isExpiredGoogleSession = function(google) {
	var date = new Date();

	// check expiresTime 
	if (google && google.expiresTime > 0 && date.getTime() > google.expiresTime - 100 * 1000) {
		return true;
	} else {
		return false;
	}
	// return true;
}
