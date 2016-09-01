(function() {
  'use strict';

  angular
    .module('AnyDayBuddyAds')
    .service('DropzoneService', DropzoneService);


  function DropzoneService() {
    var service = {
      create: create,
      createMultiple: createMultiple
    };

    return service;

    function create(success, sending, removedfile) {
      return {
        options: {
          url: 'https://api.cloudinary.com/v1_1/cloud9/image/upload',
          uploadMultiple: false,
          maxFiles: 1,
          acceptedFiles: 'image/*',
          dictDefaultMessage: 'Drop file or click here to upload',
          addRemoveLinks: true
        },
        eventHandlers: {
          sending: function(file, xhr, formData) {
            formData.append('api_key', 839988333153567);
            formData.append('timestamp', Date.now() / 1000 | 0);
            formData.append('upload_preset', 'sm2ev4nu');
            if (sending) sending();
          },
          success: success,
          removedfile: removedfile
        }
      };
    }

    function createMultiple(maxFiles, success, sending) {
      return {
        options: {
          url: 'https://api.cloudinary.com/v1_1/cloud9/image/upload',
          maxFiles: maxFiles,
          acceptedFiles: 'image/*',
          dictDefaultMessage: 'Drop files or click here to upload'
        },
        eventHandlers: {
          sending: function(file, xhr, formData) {
            formData.append('api_key', 839988333153567);
            formData.append('timestamp', Date.now() / 1000 | 0);
            formData.append('upload_preset', 'sm2ev4nu');
            if (sending) sending();
          },
          success: success
        }
      };
    }
  }

})();
