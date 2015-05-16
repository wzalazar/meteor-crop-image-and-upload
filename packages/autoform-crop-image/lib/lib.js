/**
  * Return result for FileReader and call showImageIncrop
  */
getResult = function() {
 	 /* Return Base 64 */
     var b64 = this.reader.result;
     plugin.showImageInCrop(this.template.$('.image-cropper'),b64)
 }

/**
  * Read files when change data in input type file
  * and put original data inside the input hidden
  */
handleFileSelect = function(evt) {
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
saveCropImage = function(b64,callback){
		var 
			  newFile = new FS.File();

    newFile.attachData(b64, {type: 'image/png'}, function(error){
    	if(error) throw error;
        newFile.name('new.png');

        Images.insert(newFile, function(err, result){
           if(!err){
              callback(result._id);
           } 
        });
    });

 };

 /**
  * Save image in Database
  * @param {Object} template - is the current template
  */
updateCropImage = function(b64,value,callback){
    if (value){
        Images.remove({'_id':value});
        saveCropImage(b64,callback);
    }
    else{
      saveCropImage(b64,callback);
    }
  
 };

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
convertImgToBase64 = function(url, callback, outputFormat){
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


justifiedGallery = function(){
    $('.gallery').each(function(){
        $(this).justifiedGallery({
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
            Session.set('loadingPhotos',false);
        }).on('jg.resize', function (e) {
          // this callback runs after the gallery is resized
        }).on('jq.rowflush', function (e) {
          // this callback runs when a new row is ready
        });
    })
}