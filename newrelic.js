'use strict';
exports.config = {
	app_name: ['notification_be'],
	license_key: '4d3deb927f2e8a24d2ef374ccd02abe18a4bNRAL',
	logging: {
		level: 'info',
	},
	allow_all_headers: true,
	attributes: {
		exclude: [
			'request.headers.cookie',
			'request.headers.authorization',
			'request.headers.proxyAuthorization',
			'request.headers.setCookie*',
			'request.headers.x*',
			'response.headers.cookie',
			'response.headers.authorization',
			'response.headers.proxyAuthorization',
			'response.headers.setCookie*',
			'response.headers.x*',
		],
	},
};
