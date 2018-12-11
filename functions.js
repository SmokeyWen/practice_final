const request = require('request');

var geocode = (address) => {
    // return new Promise
    return new Promise((resolve, reject) => {
    	request({
    		url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBdZyWZ9E-pTqDt7hO4rAauB7BDeOPaAJM`,
    		json: true
    	}, (error, response, body) => {
    		if (error) {
    			reject('Cannot connect to Google Maps');
    		} else if (body.status === 'ZERO_RESULTS'){
    			reject('Cannot find requested address');
    		} else if (body.status === 'OK') {
    			resolve({
    				lat: body.results[0].geometry.location.lat,
    				lng: body.results[0].geometry.location.lng
    			});
    		}
    	})
    })
};

var weather = (lat, lng) => {
        return new Promise ((resolve, reject) => {
            request({
                url: 'https://api.darksky.net/forecast/3ed3bebeb1f6b38a497bdca6579a809c/' + lat + ',' + lng,
                json: true
            }, (error, response, body) => {
                if (error) {
                    reject('Rejected from Darksky');
                }else{
                    resolve({
                        temperature: body.currently.temperature,
                        weather: body.currently.summary
                    });

                }
            })
        })
    };

var getPic = (keyWord) => {
    // return new Promise
    return new Promise((resolve, reject) => {
        request({
            url: `https://pixabay.com/api/?key=10968986-80781cc7f6d43907ea9cebfeb&q=${keyWord}&image_type=photo`,
            json: true
        }, (error, response, body) => {
            if (error) {
                reject('Something went wrong on pixabay');
            } else if (body.totalHits === 500) {
                resolve({
                    picUrl1: body.hits[0].largeImageURL,
                    picUrl2: body.hits[1].largeImageURL,
                    picUrl3: body.hits[2].largeImageURL,
                    picUrl4: body.hits[3].largeImageURL,
                    picUrl5: body.hits[4].largeImageURL,
                });
            }
        })
    })
};

module.exports = {
    geocode,
    weather,
    getPic
}