showImage = function(){
	
}

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
  	if (Meteor.isClient){
  		fieldName = new ReactiveVar();
  		fieldName.set(context.name);
	  	
	  	if (!photoId){
	  		photoId = new ReactiveVar();
	  	}

  		if (context.value && photoId.get()!== ""){
	  		photoId.set(context.value);
  		}
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


		$(this.find('.tags')).tagsinput('refresh');

		Tracker.autorun(function(){
			image = Images.findOne(photoId.get());
			imageId = new ReactiveVar();
			if (image){
	  			imageId.set(image._id);
				plugin.showImageInCropByUrl($('.image-cropper')[0],window.location.origin + "" +image.url());
			}
		})
	

		
	});

	function addAFHook(formId) {
		AutoForm.addHooks(formId, {
		  before: {
		    insert: function(doc){
		    	var _this = this;
		    	saveCropImage(this.template, function(idImage){
			    	doc[fieldName.get()] = idImage;
	                _this.result(doc);
		    	});
		    },
		    update: function(doc){
		    	var _this = this;
		    	updateCropImage(imageId.get(), this.template, function(idImage){
		    		doc.$set[fieldName.get()] = idImage;
	                _this.result(doc);
		    	});
		    }
		  }
		});
	}
}