Template.uploadCropImage.helpers({
	'value': function(){
		return this.value.value;
	},

	'width': function(){
		return this.width;
	},

	'height': function(){
		return this.height;
	},

	'url': function(){
		image = Images.findOne(this.value.value);
		if (image){
			return window.location.origin + "" +image.url();
		}
	}
})

Template.uploadCropImage.events({
	'change .image': function(event, template) {
		var bindHandleFileSelect = _.bind(handleFileSelect,{'template':template});
		var execHandleFileSelect = _.partial(bindHandleFileSelect)
		execHandleFileSelect(event);
	}
})

Template.uploadCropImage.onRendered(function() {
	$(this.find('.image-cropper')).cropit();
	$(this.find('.image-cropper')).cropit('previewSize', { width: this.data.width, height: this.data.height });
})

