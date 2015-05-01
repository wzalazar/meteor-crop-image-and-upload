 var getResult = function(e) {
 	 /* Return Base 64 */
     var b64 = this.reader.result;
     this.template.$('.image-cropper').cropit('imageSrc', b64);
 }

 var handleFileSelect = function(evt) {
 	 var template = this.template;
     var files = evt.target.files;
     var file = files[0];

     if (files && file) {
         var reader = new FileReader();

         var bindGetResult = _.bind(getResult,{'reader':reader,'template':template});
         var execGetResult = _.partial(bindGetResult);
         reader.onload = execGetResult;
         reader.readAsDataURL(file);
         template.$('.origin-file-hidden').data("cfsaf_files", file);
     }
 };

 var saveCropImage= function(template){
 	$(template.$('.image-cropper')).each(function(){

		var 
			originFile= template.$('.origin-file-hidden').data("cfsaf_files"),
		    b64 = $(this).cropit('export', {
						type: 'image/png',
						quality: .9,
						originalSize: true
				   });

		if (b64){
			
			var newFile = new FS.File();
				newFile.attachData(b64, {type: 'image/png'}, function(error){
					if(error) throw error;
				    newFile.name(originFile.name);

				    Images.insert(newFile);
				});
		}
	});
 }


Template.uploadCropImage.onRendered(function() {
	$(this.find('.image-cropper')).cropit();
})

Template.uploadCropImage.events({
	'change .image': function(event, template) {
		var bindHandleFileSelect = _.bind(handleFileSelect,{'template':template});
		var execHandleFileSelect = _.partial(bindHandleFileSelect)
		execHandleFileSelect(event);
	}
})


 Template.formCropImage.events({
     'submit #upload': function(event, template) {
        event.preventDefault();
        saveCropImage(template);
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

