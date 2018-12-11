const express = require('express');
const hbs = require('hbs');
const request = require('request');
const functions = require('./functions.js');

var bodyParser = require('body-parser');
var fs = require('fs');
var hompage = require('./homepage.js');
var app = express();
var port = process.env.PORT || 8080;
// var urlencodedParser = bodyParser.urlencoded({ extended: false })


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// hbs.registerHelper('test_function', (text) => {
// 	return text.toUpperCase();
// });

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

app.get('/', (request, response) => {
	response.render('homepage.hbs', {
		name: 'Pixabay Page',
		welcomeMessage: 'This should be caps'
	});
});

app.post('/about', (req, response) => {
	var location = req.body.locationName;
	var resultArr = [];
	console.log(location);

	if (fs.existsSync('test.json')) {
		var readFile = fs.readFileSync('test.json');
	} else {
		var readFile = ''
	}

	if (readFile !== ''){
		receivedData = JSON.parse(readFile);
		receivedData.push(location);
		var locString = JSON.stringify(receivedData);
		fs.writeFileSync('test.json', locString);
	}else{
		resultArr.push(location);
		arrJson = JSON.stringify(resultArr);
		fs.writeFileSync('test.json', arrJson);
	}

	functions.geocode(location).then((result) => {
	    console.log(result);
	    return functions.weather(result.lat, result.lng);
	}, (errorMessage) => {
	    console.log(errorMessage);
	}).then((result) => {
		if(result.weather === "Drizzle"){
			response.render('about.hbs', {
			name: 'Weather Page',
			results: `The temperature in ${location} is ${result.temperature} and it is ${result.weather}`,
			weatherPic: 'https://cdn3.iconfinder.com/data/icons/stylized-weather-icons/745/302HeavyDrizzle.png'
			})
		}else if (result.weather === "Partly Cloudy"){
			response.render('about.hbs', {
			name: 'Weather Page',
			results: `The temperature in ${location} is ${result.temperature} and it is ${result.weather}`,
			weatherPic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc4losmFzAOSRl9BseA_60SJXuAMBwSW51ofUfjncurHge4z_y'
			})
		}else if (result.weather === "Rainy"){
			response.render('about.hbs', {
			name: 'Weather Page',
			results: `The temperature in ${location} is ${result.temperature} and it is ${result.weather}`,
			weatherPic: 'https://previews.123rf.com/images/pandavector/pandavector1702/pandavector170201347/71535193-scottish-rainy-weather-icon-in-cartoon-style-isolated-on-white-background-scotland-country-symbol-st.jpg'
			})
		}
		
	}, (error) => {
		console.log(error);
	})
	

	// response.render('about.hbs', {
	// 	name: 'Alexander',
	// 	welcomeMessage: 'This should be caps',
	// 	inputLocation: location
	// })
})

app.get('/about', (request, response) => {
	response.render('about.hbs', {
		name: 'Weather Page'
	});
});

app.post('/homepage', (request, response) => {
	var keyword = request.body.keyWord;
	console.log(keyword);
	functions.getPic(keyword).then((result) => {
		console.log(result);
		response.render('homepage.hbs', {
			name: "Pixabay Gallery",
			pic1: result.picUrl1,
			pic2: result.picUrl2,
			pic3: result.picUrl3,
			pic4: result.picUrl4,
			pic5: result.picUrl5
		})
	}, (errorMessage) => {
		console.log(errorMessage);
	})
})

app.listen(port, () => {
	console.log('Server is up on port 8080');
});