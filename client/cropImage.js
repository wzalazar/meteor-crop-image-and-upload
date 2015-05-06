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
	 },

	  /**
 	   * Show image in from url
 	   * @param {Object} nodeHTML - node html 
 	   * @Paran {string} url - url
 	   */
	 'showImageInCropByUrl' : function(nodeHtml,url){
	 	$(nodeHtml).cropit('imageSrc', url);
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
				    newFile.name(originFile ? originFile.name : 'new.png');

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

var configPixabay = {
	'url': 'http://pixabay.com/api/',
	'username': 'wzalazar',
	'key': '3437b590d6d64b8365fa'
}

var searchGallery = function(tags){
	HTTP.call('GET', configPixabay.url+'?username='+configPixabay.username+'&key='+configPixabay.key+'&q='+tags+'&image_type=photo', function(error, result){
	 	if (error){
	 		console.log(error);
	 		return;
	 	}
	 	justifiedGallery();
	 	gallery.set(result.data.hits);
	});
}

Template.uploadCropImageAsService.onRendered(function() {
	$(this.find('.image-cropper')).cropit();
})

Template.pixabay.onCreated(function(){
	gallery = new ReactiveVar();
})

Template.pixabay.onRendered(function(){
	
})

Template.pixabay.helpers({
	'images': function(){
		return gallery.get();
	}
})

Template.pixabay.events({
	'click .search-gallery': function(event,template){
		event.preventDefault();
		var tags = template.$('.tags').tagsinput('items').join('+');
		searchGallery(tags);
	},

	'click .select-image': function(event,template){

		var nodeHTML = template.$('.image-cropper');
		var url = $(event.target).attr('src');
		var urlExample = 'http://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png';
		convertImgToBase64(url, function(base64Img){
			plugin.showImageInCrop(nodeHTML,base64Img);
		});
	}
})

Template.formCropImageService.events({
     'submit #upload': function(event, template) {
        event.preventDefault();
        saveCropImage(template);
     }
 })


/**
 * convertImgToBase64
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat='image/png']
 * @author HaNdTriX
 * @example
	convertImgToBase64('http://goo.gl/AOxHAL', function(base64Img){
		console.log('IMAGE:',base64Img);
	})
 */
function convertImgToBase64(url, callback, outputFormat){
	var canvas = document.createElement('CANVAS');
	var ctx = canvas.getContext('2d');
	var img = new Image;
	img.crossOrigin = 'Anonymous';
	img.onload = function(){
		canvas.height = img.height;
		canvas.width = img.width;
	  	ctx.drawImage(img,0,0);
	  	var dataURL = canvas.toDataURL(outputFormat || 'image/png');
	  	callback.call(this, dataURL);
        // Clean up
	  	canvas = null; 
	};
	img.src = url;
}


function justifiedGallery(){
    $('#gallery').justifiedGallery({
	  // option: default,
	  rowHeight: 120,
	  maxRowHeight: 0,
	  lastRow: 'nojustify',
	  fixedHeight: false,
	  captions: true,
	  margins: 1,
	  randomize: false,
	  extension: /.[^.]+$/,
	  refreshTime: 250,
	  waitThumbnailsLoad: true,
	  justifyThreshold: 0.35,
	  cssAnimation: false,
	  imagesAnimationDuration: 300
	}).on('jg.complete', function (e) {
	  // this callback runs after the gallery layout is created
	}).on('jg.resize', function (e) {
	  // this callback runs after the gallery is resized
	}).on('jq.rowflush', function (e) {
	  // this callback runs when a new row is ready
	});
}