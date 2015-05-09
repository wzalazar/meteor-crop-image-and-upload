var configPixabay = {
	'url': 'http://pixabay.com/api/',
	'username': 'wzalazar',
	'key': '3437b590d6d64b8365fa'
}

searchGallery = function(tags){
	HTTP.call('GET', configPixabay.url+'?username='+configPixabay.username+'&key='+configPixabay.key+'&q='+tags+'&image_type=photo', function(error, result){
	 	if (error){
	 		console.log(error);
	 		return;
	 	}
	 	justifiedGallery();
	 	gallery.set(result.data.hits);
	});
}