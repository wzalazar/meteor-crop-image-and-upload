 /**
   * Interface for implement plugin crop want to use
   * This example use Crop it
   * @URL https://github.com/scottcheng/cropit
   */
 var plugin = {

 	 /**
 	   * Show image in Base 64 inside crop zone html
 	   * @param {Object} nodeHTML - node html 
 	   * @Paran {object} b64 - image in base 64
 	   */
	 'showImageInCrop' : function(nodeHtml,b64){
	 	$(nodeHtml).cropit('imageSrc', b64);
	 },

	  /**
 	   * Export image croped to base 64 ready for to save
 	   * @param {object} nodeHTML - node html
 	   * @return {string} b64 - image base 64
 	   */
	 'exportToB64' :  function(nodeHtml){
	 	return $(nodeHtml).cropit('export', {
					type: 'image/png',
					quality: .9,
					originalSize: true
			    });
	 }
 }


/**
  * Return result for FileReader and call showImageIncrop
  */
 var getResult = function() {
 	 /* Return Base 64 */
     var b64 = this.reader.result;
     plugin.showImageInCrop(this.template.$('.image-cropper'),b64)
 }

 /**
  * Read files when change data in input type file
  * and put original data inside the input hidden
  */
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

 
 /**
  * Save image in Database
  * @param {Object} template - is the current template
  */
 var saveCropImage= function(template){
 	$(template.$('.image-cropper')).each(function(){

		var 
			originFile= template.$('.origin-file-hidden').data("cfsaf_files"),
		    b64 = plugin.exportToB64(this);

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

