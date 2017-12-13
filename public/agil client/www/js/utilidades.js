function updateHiddenValue(elementIdWhereToSetValue,base64EncodedImage)
{
	$('#'+elementIdWhereToSetValue).attr("value",base64EncodedImage);
	$('#'+elementIdWhereToSetValue).trigger('change');
}

function setImage(base64EncodedImage,elementIdWhereToSetValue){
	updateHiddenValue(elementIdWhereToSetValue,base64EncodedImage);
}

function uploadImage(element,imageValue){
	generateBase64EncodedImage(element,imageValue);
}

function generateBase64EncodedImage(inputFileElement,elementIdWhereToSetValue)
{
	var filesSelected = inputFileElement.files;
    if (filesSelected.length > 0)
	{
        var fileToLoad = filesSelected[0];
        var fileReader = new FileReader();

        fileReader.onloadend = function() 
		{
            var base64EncodedImage = fileReader.result; // <--- data: base64
			setImage(base64EncodedImage,elementIdWhereToSetValue);
        }
        fileReader.readAsDataURL(fileToLoad);	
	}
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

function convertUrlToBase64Image(url,callBack)
{
	var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL('image/jpg');
        callBack(dataURL);
        canvas = null; 
    };
    img.src = url;
}

function reproducirVideo(input){
	var video = document.getElementById('video');
	var source = document.getElementById('mp4');
	source.src = URL.createObjectURL(input.files[0]);
	  // not really needed in this exact case, but since it is really important in other cases,
	  // don't forget to revoke the blobURI when you don't need it
	source.onend = function(e) {
		URL.revokeObjectURL(input.src);
	}
	video.load();
	video.play();
	var $video  = $('video');
	 $video.css({
        'height': screen.height, 
        'width' : "auto"
    });
}