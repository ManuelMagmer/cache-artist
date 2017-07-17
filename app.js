var axios = require('axios'),
 Q = require('q'),
 fs = require('fs'),
 path = require('path'),
 filePath = 'myList.txt';


var MIN_CHART_NAME = 2;
var BOT = {
	email: "adminbot5@soundcharts.com",
	password: "eaaa1557187444022aec05f4c09d47df2e627642"
}

var security = {
		email: "moussaab.aitfdil@gmail.com",
		password: "6b1f496863a456b6245f22e3497d4d76ed30c934"
	},
	query = {
		NumSpinner: 0
	}


var getChartsList = (_charts) => {
	if (!Array.isArray(_charts))
		return [];
	var list = [];
	_charts.forEach((_chart) => {
		list.push(
			axios.get(`https://soundcharts.com/api/rang/musique/?info={"email":"${BOT.email}","password":"${BOT.password}"}&data={"NumSpinner":"${_chart}"}`))
	});
	return list;
}

var queryBase = (_charts) => {
	var def = Q.defer(),
		list = [],
		relevants = [];
	var chartsRequired = _charts.split('-');
	var required = getChartsList(chartsRequired);

	// if (!chartsRequired.length || !required.length) {
	// 	def.resolve({
	// 		message: 'Enter a charts ID please'
	// 	});
	// 	return def.promise
	// }

//	fs.exists('listCacheArtist', (exists) => {
//		if (exists) {
//			fs.open('listCacheArtist', 'a+', (err, fd) => {
//				readMyData(fd);
//			});
//		} else {
//			console.error('the file list Cache Artist does not exist');
//		}
//	});

	axios.all(required)
		.then((_list) => {
			var charts, ids = [],
				list = [];
			for (charts in _list) {
				var artist;
				if (_list[charts].data.length) {
					for (artist in _list[charts].data) {
						if (ids.indexOf(_list[charts].data[artist].NumElement) === -1) {
							list.push({
								name: _list[charts].data[artist].NomAuteur,
								id: parseInt(_list[charts].data[artist].NumElement)
							})
							ids.push(_list[charts].data[artist].NumElement)
						}
					}
				}
			}

			console.log('   charts ... existe + length : ', list.length , 'filePath', filePath);

			var listFile;

			fs.exists(filePath, function (exists) {
				if (exists) {
					console.log("File opened successfully!");
					fs.readFile(filePath, {
						encoding: 'utf-8'
					}, function (err, data) {
						if (err) {
							return console.error("Asynchronous read error: ", err);
						}
//						console.log("Asynchronous read: " + JSON.parse(data));
						listFile = JSON.parse(data);
						
					});
					console.log('listFile read', listFile);
					
				} else {
					var bufferList = new Buffer.from(list);
					console.log("list in buffer : ", bufferList);
					 fs.open(filePath, 'w+', (err, fd) => {
					   if (err) {
					     return console.error(err);
					   }
					
					   fs.writeFile(filePath, JSON.stringify(list), function(err) {
					     if (err) {
					       return console.error(err);
					     }
					   });
					
					 });
				}
			});


		})
		.catch(function (error) {
			def.resolve({
				message: 'Oops! je'
			})
		});

	return def.promise;
}




queryBase("142")
	.then((_charts) => {
		console.log(_charts)
	});
