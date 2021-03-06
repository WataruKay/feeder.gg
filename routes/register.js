var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userModel = require('../model');
var config = require('../config');
var jwt = require('jsonwebtoken');
var cookie = require('js-cookie');


//connect to db
mongoose.connect(config.database);


//get register page
router.get('/', function(req,res, next){
	res.render('register');
});

router.post('/newRegister', function(req,res,next){
	console.log("new registration recieved");
	//console.log(cookie.get());

	//console.log(req.body);

	//check if email is already registered
	//if it is return an error
	//otherwise add a new user into the db

	var user = new userModel({
		email: req.body.email,
		password: req.body.password,
		summonername: req.body.summonername,
		region: req.body.region
	});

	console.log(user);

	userModel.findOne({email:user.email},function(err,docs){
		if (err) throw err;
		if (docs){
			return res.json({success:false, message: 'That email address already exists.'});
		} else {
			user.save(function(err){
				if(err) {
					return res.json({ success: false, message: 'That email address already exists.'});
				}

			console.log('User saved successfully');

			var tokenPayload = {
				email : req.body.email,
				summonername : req.body.summonername,
				region : req.body.regin
			}

			var token = jwt.sign(tokenPayload, config.secret, {
              expiresIn: 10080 // in seconds
            });
			// res.setHeader('charset', 'utf-8');
			// res.setHeader('Set-Cookie', 'jwt'=token);

			//set jwt as cookie - cookie method
			res.cookie('jwt',token, { maxAge: 900000, httpOnly: true });
			res.json({success: true, message: 'New User Added Successfully', jwt: token});

			//set jwt as response header
			// res.writeHead(200, {
   //  			'content-type': 'text/html',
   //  			'authorization': token
  	// 		});
  	// 		res.end();
  			//res.json({success: true, message: 'New User Added Successfully', jwt: token})

			});
		}
	});
});

module.exports = router;