Template.galleryService.onCreated(function(){
	gallery = new ReactiveVar();
})

Template.galleryService.helpers({
	'images': function(){
		return Session.get('resultServiceGallery'); 
	}
})

Template.galleryService.events({
	'click .search-gallery': function(event,template){
		event.preventDefault();
		var tags = template.$('.tags').tagsinput('items').join('+');
		searchGallery(tags);
	}
})





