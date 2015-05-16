Meteor.startup(function(){
	renderUploadCropImage = new Tracker.Dependency;
})

AutoForm.addInputType("crop-image", {
  template: "afCropImage",
  valueOut: function () {
  	return this.val();
  },
  valueConverters: {
  	"string": function (val) {
      if (typeof val === "number") {
        return val.toString();
      }
      return val;
    }
  },
  contextAdjust: function (context) {
  	if (Meteor.isClient && context){
  		renderUploadCropImage.changed();
  	}
  	return context;
  }
  
});

if (Meteor.isClient) {

	Template.afCropImage.events({
		'click .select-image': function(event,template){
			var nodeHTML = template.$('.image-cropper');
			var url = $(event.target).attr('src');
			convertImgToBase64(url, function(base64Img){
				plugin.showImageInCrop(nodeHTML,base64Img);
			});
		}
	})

	Template.afCropImage.helpers({
		'getPathAbsImageCfs': function(image){
			return window.location.origin + "" + image;
		},

		'getImage': function(imageId){
			return{
				image: Images.findOne(imageId)
			}
		}
	})

	var hookTracking = {};
	Template.afCropImage.onRendered(function(){
		var formId;

		// backwards compatibility with pre 5.0 autoform
		if (typeof AutoForm.find === 'function') {
		  formId = AutoForm.find().formId;
		} else {
		  formId = AutoForm.getFormId();
		}

		// By adding hooks dynamically on render, hopefully any user hooks will have
		// been added before so we won't disrupt expected behavior.
		if (!hookTracking[formId]) {
		  hookTracking[formId] = true;
		  addAFHook(formId);
		}


		$(this.find('.tags')).each(function(){
			$(this).tagsinput('refresh');
		})
	});

	function addAFHook(formId) {
		AutoForm.addHooks(formId, {
		  before: {
		    insert: function(doc){
		    	var _this = this;
		    	var _doc = doc;

		    	async.each($('.image-cropper'),function(field,callback){
		    		
		    		var schemaKey = $(field).attr('data-schema-key');
		    		var b64 = plugin.exportToB64($(field)[0]);
		    		if (b64){
				    	saveCropImage(b64, function(idImage){
				    		_doc[schemaKey] = idImage;
				    		callback();
				    	});
		    		}
		    	}, function(err){
		    		if (err){
		    		}
		    		else{
			         	_this.result(_doc);
		    		}
		    	});

		    },
		    update: function(doc){
		    	var _this = this;
		    	var _doc = doc;

		    	async.each($('.image-cropper'),function(field,callback){
		    		var schemaKey = $(field).attr('data-schema-key');
		    		var value = $(field).attr('data-value');
		    		var b64 = plugin.exportToB64($(field)[0]);
			    	updateCropImage(b64,value, function(idImage){
			    		_doc.$set[schemaKey] = idImage;
			    		callback();
			    	});
		    		

		    	}, function(err){
		    		if (err){
		    		}
		    		else{
			         	Session.set('resultServiceGallery',[]);
			         	delete _doc.$unset
			         	_this.result(_doc);
		    		}
		    	});
		    }
		  }
		});
	}
}