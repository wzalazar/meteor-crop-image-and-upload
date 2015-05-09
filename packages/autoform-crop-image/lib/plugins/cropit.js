 /**
   * Interface for implement plugin crop want to use
   * This example use Crop it
   * @URL https://github.com/scottcheng/cropit
   */
 plugin = {

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
