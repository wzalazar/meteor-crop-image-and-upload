var configPixabay = {
	'url': 'http://pixabay.com/api/',
	'username': 'wzalazar',
	'key': '3437b590d6d64b8365fa'
}

searchGallery = function(tags){
	Session.set('loadingPhotos',true);
	HTTP.call('GET', configPixabay.url+'?username='+configPixabay.username+'&key='+configPixabay.key+'&q='+tags+'&image_type=photo', function(error, result){
	 	if (error){
	 		console.log(error);
	 		return;
	 	}
	 	Session.set('resultServiceGallery',result.data.hits);
	 	Meteor.setTimeout(function(){
	 		justifiedGallery();
	 		$('.gallery').show();
	 	},100);

	});
}