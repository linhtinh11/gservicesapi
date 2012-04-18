var rest = require('restler');

module.exports.CloudPrint = function CloudPrint(_accessToken) {
	//access token to use google cloud print
	this.accessToken = _accessToken;
}

module.exports.CloudPrint.prototype = {
    // submit a job with a PDF file to a specified printer id
    // pdf is an object with some properties {content, fileName, fileSize}
    submitPDF: function(printerID, title, capabilities, pdf, tag, callback) {
        var content = {
            data: pdf.content
            , filename: pdf.fileName
            , fileSize: pdf.fileSize
            , contentType: 'application/pdf'
        };
        this.submit(printerID
                    , title
                    , capabilities
                    , content
                    , content.contentType
                    , tag
                    , callback);
    },
    // submit a job to a specified printer id
    submit: function(printerID, title, capabilities, content, contentType, tag, callback) {
        var url = 'http://www.google.com/cloudprint/submit';
        var opts;

        if (typeof this.accessToken == 'undefined') {
            callback("{\"success\":\"false\",\"message\":\"login required\"}");
            return;
        }

        opts = {
            headers: {
                Authorization: 'OAuth ' + this.accessToken
            }
            , multipart: true
            , data: {
                content: content
                , capabilities: capabilities
                , printerid: printerID
                , title: title
                , contentType: contentType
                , tag: tag
            }
        };

        rest['post'](url, opts)
            .on('complete', function(data) {
                callback(data);
            });
    },

    // get jobs list from server
    // printerID is optional
    jobs: function(printerID, callback) {
        var url = 'http://www.google.com/cloudprint/jobs';
        var opts = {};
        
        if (typeof this.accessToken == 'undefined') {
            callback("{\"success\":\"false\",\"message\":\"login required\"}");
            return;
        }
        
        opts.headers = {
            Authorization: 'OAuth ' + this.accessToken
        };
        
        if (typeof printerID != 'undefined') {
            opts.data = {
                printerid: printerID
            };
        }
        
        rest['post'](url, opts)
            .on('complete', function (data, res) {
                callback(data);
            });
    },

    // delete a job
    deletejob: function(jobID, callback) {
        var url = 'http://www.google.com/cloudprint/deletejob';
        var opts = {};
        
        if (typeof this.accessToken == 'undefined') {
            callback("{\"success\":\"false\",\"message\":\"login required\"}");
            return;
        }
        
        opts.headers = {
            Authorization: 'OAuth ' + this.accessToken
        };
        
        if (typeof jobID != 'undefined') {
            opts.data = {
                jobid: jobID
            };
        }
        
        rest['post'](url, opts)
            .on('complete', function (data, res) {
                callback(data);
            });
    },

    // get printer information
    printer: function(printerID, callback) {
        var url = 'http://www.google.com/cloudprint/printer';
        var opts = {};
        
        if (typeof this.accessToken == 'undefined') {
            callback("{\"success\":\"false\",\"message\":\"login required\"}");
            return;
        }
        
        opts.headers = {
            Authorization: 'OAuth ' + this.accessToken
        };
        
        if (typeof printerID != 'undefined') {
            opts.data = {
                printerid: printerID
            };
        }
        
        rest['post'](url, opts)
            .on('complete', function (data, res) {
                callback(data);
            });
    },

    // get printer list
    search: function(query, callback) {
        var url = 'http://www.google.com/cloudprint/search';
        var opts = {};
        
        if (typeof this.accessToken == 'undefined') {
            callback("{\"success\":\"false\",\"message\":\"login required\"}");
            return;
        }
        
        opts.headers = {
            Authorization: 'OAuth ' + this.accessToken
        };
        
        if (typeof q != 'undefined') {
            opts.data = {
                q: query
            };
        }
        
        rest['post'](url, opts)
            .on('complete', function (data, res) {
                callback(data);
            });
    }
}
