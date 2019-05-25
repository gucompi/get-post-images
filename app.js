var express	=	require("express");
var multer	=	require('multer');
var app	=	express();
var fs = require('fs');
var mime = require('mime');
var cors = require('cors')

app.use(cors({
    origin: 'http://localhost:3001'
}))

// Allows cross-origin domains to access this API
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Methods', 'GET,POST');
    next();
});
var imagenADevolver=''
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/'+file.fieldname);
  },
  filename: function (req, file, callback) {
    if((/\.(gif|jpg|jpeg|tiff|png)$/).test(file.originalname)){

      imagenADevolver=req.headers.userid +'.'+ file.mimetype.split('/')[1]
      callback(null, req.headers.userid +'.'+ file.mimetype.split('/')[1]);
    }
    else{
      callback('Extension no permitida',null)
    }
  }
});


var storagePub	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/'+file.fieldname);
  },
  filename: function (req, file, callback) {
    if((/\.(gif|jpg|jpeg|tiff|png)$/).test(file.originalname)){

      imagenADevolver=req.headers.product+ '_' + req.headers.num +'.'+ file.mimetype.split('/')[1]
      callback(null, req.headers.product+ '_' + req.headers.num +'.'+ file.mimetype.split('/')[1] );
    }
    else{
      callback('Extension no permitida',null)
    }
  }
});

var upload = multer({ storage : storage}).single('userPhoto');
var uploadPub = multer({ storage : storagePub}).single('pubPhoto');


app.post('/api/photo',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		res.send({imagen:imagenADevolver});
	});
});

app.post('/api/pubPhoto',function(req,res){
	uploadPub(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		res.send({imagen:imagenADevolver});
	});
});

app.use(express.static(__dirname + '/uploads'));

// Downloading a single file
app.get('/file/user/:photo', (req, res) => {
    var file = __dirname + '/uploads/userPhoto/'+req.params.photo;
    
        
        res.contentType('image/'+mime.getType(file) )
        res.download(file)
    
    
});
app.get('/file/pub/:photo', (req, res) => {
    var file = __dirname + '/uploads/pubPhoto/'+req.params.photo;
    
        
        res.contentType('image/'+mime.getType(file) )
        res.download(file)
    
    
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});