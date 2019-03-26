const fs = require('fs');
const promisify = require('util').promisify;
const path = require('path');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require('handlebars');
const mime = require('./mime');
const compress = require('./compress');
const isFresh = require('./cache');
const config = require('../config/defaultConfig');
const range = require('./range');


const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath, 'utf-8');
const template = Handlebars.compile(source);

module.exports = async function(req, res, filePath, config){
	try {
		// const stat = await stat(filePath);
		const stats = await stat(filePath);
		if(stats.isFile()) {
			const contentType = mime(filePath);
			res.setHeader('Content-Type',contentType)

			let rs;

			if(isFresh) {
				res.statusCode = 304;
				res.end();
				return;
			}

			const {code, start, end} = range(stats.size, req, res);
 			 if(code === 200) {
				res.statusCode = 200;
				rs = fs.createReadStream(filePath, {start, end});
			} else {
				res.statusCode = 206;
				rs = fs.createReadStream(filePath,{start, end});
			}

			if(filePath.match(config.compress)) {
				rs = compress(rs, req, res);
			}

			rs.pipe(res);

		} else if (stats.isDirectory()) {
			//如果是文件夹
			files = await readdir(filePath);
			res.statusCode = 200;
			res.setHeader('content-type','text/html');

			
			
			const data = {
				title: path.basename(filePath),
				files: files.map(file => {
					return {
						file,	
						icon: mime(file)
					}
				})
			}
			res.end(template(data));
		}
	}catch(ex) {
		console.log(ex);
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/plain');
		res.end(`${filePath} is not a directory or file \n ${ex.toString()}`)
	}
}


