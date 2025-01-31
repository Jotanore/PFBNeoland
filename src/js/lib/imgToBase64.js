/**
 * convertImgToBase64
 * @param  {String} url
 * @param  {Function} callback
 * @param  {String} [outputFormat='image/png']
 * @example
	convertImgToBase64('http://goo.gl/AOxHAL', function(base64Img){
		console.log('IMAGE:',base64Img);
	})
 */
export function convertImgToBase64(url, callback, outputFormat = 'image/png'){
  var canvas = document.createElement('CANVAS');
  var ctx = canvas.getContext('2d');
  var img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    canvas.height = img.height;
    canvas.width = img.width;
      ctx.drawImage(img,0,0);
      var dataURL = canvas.toDataURL(outputFormat);
      callback.call(this, dataURL);
        // Clean up
      canvas = null;
  };
  img.src = url;
}