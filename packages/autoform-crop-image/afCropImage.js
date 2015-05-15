Meteor.startup(function () {
	fields = new ReactiveArray();
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
  	if (Meteor.isClient){

  		if (context.value){

	  		if ( !_.where(fields, {'name':context.name,'value':context.value} ).length )
	  		{
	  			 context.atts.value = context.value;
	  			 fields.push({'name':context.name,'value':context.value,'id':context.atts.id});
	  		}

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

		    	async.each(fields,function(field,callback){
			    	saveCropImage(field.value, _this.template, function(idImage){
			    		_doc.$set[field.name] = idImage;
			    		callback();
			    	});
		    	}, function(err){
		    		if (err){
		    		}
		    		else{
			         	_this.result(_doc);
			         	fields = [];
		    		}
		    	});
		    },
		    update: function(doc){
		    	var _this = this;
		    	var _doc = doc;

		    	async.each(fields,function(field,callback){
			    	updateCropImage(field.value, _this.template, function(idImage){
			    		_doc.$set[field.name] = idImage;
			    		callback();
			    	});
		    	}, function(err){
		    		if (err){
		    		}
		    		else{
			         	_this.result(_doc);
			         	fields = [];
			         	Session.set('resultServiceGallery',[]);
		    		}
		    	});
		    }
		  }
		});
	}
}