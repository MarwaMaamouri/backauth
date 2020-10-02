const db = require('../config/db.config.js');
const config = require('../config/config.js');
const User = db.user;
const Role = db.role;
const Fiche = db.fiche;
const Op = db.Sequelize.Op;
//const RESET_PASSWORD_KEY='468bde97-c28b28ad',
const mailgun = require("mailgun-js");
const api_key = 'bafda9f6478f1ece904397c03d5bae7d-468bde97-c28b28ad';
const DOMAIN ='sandbox6ca2ec56de7740e290cdb6e4ec7425a2.mailgun.org';
const mg = mailgun({apiKey:api_key,domain:DOMAIN});
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { role, user } = require('../config/db.config.js');
var sesAccessKey = '<email username>'
var sesSecretKey = '<email password>'

exports.signup = (req, res) => {
	// Save User to Database
	console.log("Processing func -> SignUp");
	User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	}).then(user => {
			Role.findAll({
			where: {
			name: {
			[Op.or]: req.body.roles.map(role => role.toUpperCase())
				}
			  }
			}).then(roles => {
				user.addRoles(roles).then(() => {
					res.send("User registered successfully!");
				});
			}).catch(err => {
				res.status(500).send("Error -> " + err);
			});
		}).catch(err => {
			res.status(500).send("Fail! Error -> " + err);
		})
}

exports.signin = (req, res) => {
	console.log("Sign-In");
	
			//email: req.body.email, 
		
			User.findOne({
				where: {email: req.body.email, },
				//attributes: ['name', 'username', 'email'],
				include: [{
					model: Role,
					attributes: ['id', 'name'],
					through: {
						attributes: ['userId', 'roleId'],
					}
				}]
			})



	.then(user => {
		if (!user) {
			console.log('User Not Found');
			return res.status(404).send('User Not Found.');
		}
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
		}
		var token = jwt.sign({ id: user.id }, config.secret, {
		  expiresIn: 86400 // expires in 24 hours
		});
		res.status(200).send({ auth: true, accessToken: token, user :{ name : user.name , username : user.username , email : user.email , role :user.roles }});
	}).catch(err => {
		res.status(500).send('Error ->' + err);
	});
}
exports.userContent = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			//"description": "User Content Page",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access User Page",
			"error": err
		});
	})
}

exports.adminBoard = (req, res) => {
	User.findOne({
		where:{id: req.userId},
		attributes:['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
		    attributes: ['userId', 'roleId'],
			}
		}]  

	}).then(user => {
		res.status(200).json({   
			//"description": "Admin Board",
			"user": user
		});

	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}

exports.managementBoard = (req, res) => {
	User.findOne({
		where: {
			email: req.body.email
		},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id','name'],
			through: {
				attributes: ['userId','roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "Management Board",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Management Board",
			"error": err
		});
	})
}

	

 
  //setup email data with unicode symbols
  //let mailOptions = {
	  //from: '"Nodemailer Contact"<saiida.oueslati@endatamweel.tn>', //sender address
	  //to: newUserEmail, //list of receivers
	  //subject: 'Node Contact Request', //Subject line
	  //text: 'Hello world?', //plain text body
	  //html: output //html body
  
	//};

  //send mail with defined transport object
  //transporter.sendMail(mailOptions, (error, info) => {
	  //if (error) {
		//  return console.log(error);
	  //}
	//  console.log('Message sent: %s', info.messageId);   

	  //render view here and pass in data/message
  //});

//};


exports.handler = function(req,res) {

  	var nodemailer = require('nodemailer');
  	var smtpTransport = require('nodemailer-smtp-transport');

  	var transporter = nodemailer.createTransport(smtpTransport({
	    service: 'smtp.gmail.com',
	    auth: {
			user: 'postmaster@sandbox6ca2ec56de7740e290cdb6e4ec7425a2.mailgun.org',  
			pass: '2da6d3172df09cba42260b8ec0994ccf-468bde97-03cf137e'
	    }
  	}));

  	var text = 'Email body goes here';

  	var mailOptions = {
	    from: '<saiida.oueslati@endatamweel.tn>',
	    to: '<saiida.oueslati@endatamweel.tn>',
	    bcc: '<saidaoueslati820@gmail.com>',
	    subject: 'Test subject',
	    text: text
  	};

  
}
exports.findAll = (req, res) => {
	let token = req.headers['x-access-token'];
	const type = req.query.type;
	var condition = type ? { type: { [Op.iLike]: `%${type}%` } } : null;
	Role.findAll({ where: condition })
	  .then(data => {
		res.send(data);
	  })
	  .catch(err => {
		res.status(500).send({
		  message:
			err.message || "Some error occurred while retrieving roles."
		});
	  });
};
exports.findOne = (req, res) => {
	const id = req.params.id;
  
	role.findById(id)
	  .then(data => {
		res.send(data);
	  })
	  .catch(err => {
		res.status(500).send({
		  message: "Error retrieving Role with id=" + id
		});
	  });
};
exports.findUser = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "User Content Page",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access User Page",
			"error": err
		});
	})
};
