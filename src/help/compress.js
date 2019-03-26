module.exports = function (rs, req, res) {
	const { createGzip, deflate } = require('zlib');

	const acceptEncoding = req.headers['accept-encoding'];

	if(!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {
		return fs;
	} else if(acceptEncoding.match(/\bgzip\b/)) {
		res.setHeader('Content-Encoding', 'gzip');
		return rs.pipe(createGzip())
	} else if(acceptEncoding.match(/\bdeflate\b/)){
		res.setHeader('Content-Encoding','deflate');
		return rs.pipe(deflate());
	}
}







