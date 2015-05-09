Template.viewCropImages.helpers({
	'images': function () {
		return Images.find(); 
	},

	'getPathAbsImageCfs': function(image){
		return window.location.origin + "" + image;
	}
})

Template.viewCropImages.helpers({
	'images': function () {
		return Images.find(); 
	},

	'getPathAbsImageCfs': function(image){
		return window.location.origin + "" + image;
	}
})