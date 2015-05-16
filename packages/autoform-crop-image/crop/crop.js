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

