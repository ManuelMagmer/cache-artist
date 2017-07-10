var axios = require('axios');
var Q = require('q');

var MIN_CHART_NAME = 2;
var BOT = {email:"adminbot5@soundcharts.com",password:"eaaa1557187444022aec05f4c09d47df2e627642"}

var security={email:"moussaab.aitfdil@gmail.com",password:"6b1f496863a456b6245f22e3497d4d76ed30c934"},
query = {NumSpinner: 0}


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
	var def = Q.defer(), list = [], relevants = [];

	var chartsRequired = _charts.split('-');
	var required = getChartsList(chartsRequired);
	//
	// if (!chartsRequired.length || !required.length) {
	// 	def.resolve({
	// 		message: 'Enter a charts ID please'
	// 	});
	// 	return def.promise
	// }
	axios.all(required)
		.then((_list) => {

			var charts, ids = [], list = [];
			for (charts in _list) {
				var artist;
				if (_list[charts].data.length) {
					for (artist in _list[charts].data) {
						if (ids.indexOf(_list[charts].data[artist].NumElement) === -1 ){
							list.push({
								name: _list[charts].data[artist].NomAuteur,
								id: parseInt(_list[charts].data[artist].NumElement)
							})
							ids.push(_list[charts].data[artist].NumElement)
						}
					}
				}
			}
			console.log(list)
		})
		.catch(function (error) {
			def.resolve({
				message: 'Oops!'
			})
		});
	return def.promise;
}

queryBase("142")
	.then((_charts) => {
		console.log(_charts)
	});
