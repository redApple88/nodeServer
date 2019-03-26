const http = require('http');
const config = require('./config/defaultConfig')
const route = require('./help/route');
const fs = require('fs');
const path = require('path');

const promisify = require('util').promisify;


const server = http.createServer((req, res) => {
	const filePath = path.join(config.root, req.url);
	route(req, res, filePath, config);
})

// 端口，域名，回调
server.listen(config.port, config.hostname, () => {
	console.log(`Server started at ${config.hostname}`);
})





