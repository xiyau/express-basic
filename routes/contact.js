var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'contact' });
});

router.post('/send',function(req, res, next){
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'm.xiyau@gmail.com',
			pass: 'Sndvol32@'
		}
	});

	var mailOptions = {
		from: 'siteuser@firstblog.com',
		to: 'm.xiyau@gmail.com',
		subject: 'user enquiries',
		text: 'you have new enquirie with the following details Name: '+req.body.name+ 'Email: '+req.body.email,
		html: '<p> you got a new querry </p>'
	};

	transporter.sendMail(mailOptions, function(error , info){
		if(error){
			console.log(error)
			res.redirect('/')
		}else{
			console.log("Message Sent: + info.response")
		}
	})
});

module.exports = router;
