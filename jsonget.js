'use strict';

function jsonGet(url) {
	var rv = new Promise(function(resolve, reject) {
		var http, completed = false;
		if (typeof(url) === 'string') {
			if (url.match(/^http:/i)) {
				http = require('http');
			} else if (url.match(/^https:/i)) {
				http = require('https');
			}
		}
		if (! http) {
			return reject(new Error('Bad URL'));
		}
		http.get(url, function(req) {
			if (req.statusCode != 200) {
				completed = true;
				return reject(new Error('Bad HTTP status ' + req.statusCode));
			}
			var s = '';
			req.on('data', function(data) {
				if (! completed) {
					s += data;
				}
			});
			req.on('end', function() {
				if (completed) {
					return;
				}
				try {
					s = JSON.parse(s);
				} catch (e) {
					s = undefined;
					completed = true;
					reject(e);
				}
				if (! completed) {
					completed = true;
					return resolve(s);
				}
			});
		}).on('error', function(e) {
			if (! completed) {
				completed = true;
				return reject(e);
			}
		});
	});
	return rv;
};

module.exports = jsonGet;
