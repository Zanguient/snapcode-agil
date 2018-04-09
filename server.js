// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var http =require('http').Server(app);
var bodyParser = require('body-parser');
var cors    = require('cors'); // to enable restful calls
var jwt = require("jsonwebtoken");
var PDF = require("pdfkit");
var fs = require("fs");
var md5 = require('MD5');
var forEach = require('async-foreach').forEach;
var excelbuilder = require('msexcel-builder');
var multer = require('multer');
var upload = multer({ dest: 'games/' })
var public_directory="./public/agil client/www/";
var dns = require('dns');
var os = require('os');
var aws = require('aws-sdk');
var io = require('socket.io')(http);
var schedule = require('node-schedule');
var Postgrator = require('postgrator');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

var database="agil",username="agil",dbpass="agil2017@*#";

var postgrator = new Postgrator({
  validateChecksums: false,
  // Directory containing migration files
  migrationDirectory: __dirname + '/database files/migrations',
  // Driver: must be pg, mysql, or mssql
  driver: 'mysql',
  // Database connection config
  host: '138.197.35.199',
  port: 3306,
  database: database,
  username: username,
  password: dbpass,
  // Schema table name. Optional. Default is schemaversion
  schemaTable: 'schemaversion'
});

var port = process.env.PORT || 8083;        // set our port
var S3_BUCKET = process.env.S3_BUCKET;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

var Sequelize = require('sequelize');

//DATOS DE CONEXION A LA BASE DE DATOS
var sequelize = new Sequelize(database,username, dbpass, {
  host: '138.197.35.199',
  dialect: 'mysql',
  timezone : "-04:00",
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  }
});

var ensureAuthorized=function authorize(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

var ensureAuthorizedAdministrador=function authorize(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
		if(bearer[2]=="ADMINISTRADOR" || bearer[2]=="SUPER-ADMINISTRADOR"){
			next();
		}else {
			res.send(403);
		}
    } else {
        res.send(403);
    }
}

var decodeBase64Image=function(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

var signs3=function(fileNameRequest,fileTypeRequest,callBack){
	const s3 = new aws.S3();
	const fileName = fileNameRequest;
	const fileType = fileTypeRequest;
	const s3Params = {
		Bucket: S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if(err){
		  console.log(err);
		}
		callBack(data,`https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`);
	});
}
postgrator.migrate().then(appliedMigrations => console.log(appliedMigrations))
  .catch(error => console.log(error));
io.on('connection', function(socket){console.log("fsdfs");
	require('./app/rutas')(router,sequelize,Sequelize,jwt,md5,forEach,ensureAuthorized,ensureAuthorizedAdministrador,PDF,fs,
            excelbuilder,decodeBase64Image,signs3,io,socket,schedule);
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// replace ip address

/*dns.lookup(os.hostname(), function (err, add, fam) {
	var replace = require('replace-in-file');
	replace({
	  files: './public/agil client/www/js/servicios.js',
	  replace: /http.*//*g,
	  with: 'http://'+add+':8083/";'
	}, function(error, changedFiles) { 
	  if (error) {
		return console.error('Error occurred:', error);
	  }
	});
});*/

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/agil', router);

router.route('/downloadReport/:reportName')
	.get(function(req, res) {
		res.sendfile('./reports/'+req.params.reportName);
	});
	
router.route('/downloadVideo/:videoName')
	.get(function(req, res) {
		res.sendfile('./videos/'+req.params.videoName);
	});

app.use('/',express.static(__dirname + '/public/agil client/www'));
app.use('/img',express.static(__dirname + '/img'));
app.use('/sound',express.static(__dirname + '/sound'));
app.use('/recursos',express.static(__dirname + '/example_reports'));

app.get('/', function(req, res) {
        res.sendfile('./public/agil client/www/principal.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

// START THE SERVER
// =============================================================================
http.listen(port);
console.log('Magic happens on port ' + port);
