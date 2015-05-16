Template.uploadCropImage.helpers({
	'id': function(){
		return this.id;
	},

	'value': function(){
		return this.value.value;
	},

	'schemaKey': function(){
		return this.value.atts['data-schema-key'];
	},

	'width': function(){
		return this.width;
	},

	'height': function(){
		return this.height;
	},

	'url': function(){
		renderUploadCropImage.depend();
		image = Images.findOne(this.value.value);
		if (image){
			plugin.showImageInCropByUrl($('*[data-value='+this.value.value+']'),window.location.origin + "" +image.url());
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
	renderUploadCropImage.changed();
})


