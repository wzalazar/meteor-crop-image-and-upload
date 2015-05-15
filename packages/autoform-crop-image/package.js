Package.describe({
	name: "wzalazar:autoform-crop-image",
	summary: "autoform-crop-image",
	version: "1.0.0",
	git: ''
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('templating@1.0.0');
  api.use('blaze@2.0.0');
  api.use('aldeed:autoform@5.1.2');
  api.use('reactive-var');
  api.use('cfs:standard-packages');
  api.use('cfs:gridfs');
  api.use('twbs:bootstrap');
  api.use('http');
  api.use('ajduke:bootstrap-tagsinput');
  api.use('micah:justified-gallery');
  api.use('aldeed:collection2');
  api.use('suxez:jquery-cropit');
  api.use('peerlibrary:async');
  api.use('manuel:reactivearray');
  api.addFiles([
    'afCropImage.html',
    'afCropImage.js',
    'style.css',
    'uploadCropImage/uploadCropImage.html',
    'uploadCropImage/uploadCropImage.js',
    'galleryService/galleryService.html',
    'galleryService/galleryService.js',
    'lib/api/pixabay.js',
    'lib/plugins/cropit.js',
    'lib/lib.js'
  ], 'client');
});






