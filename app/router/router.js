const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const controller = require('../controller/controller.js');
	app.post('/api/auth/signup',[verifySignUp.checkDuplicateUserNameOrEmail], controller.signup);
	
	app.post('/api/auth/signin', controller.signin);
	
	//app.get('/api/test/user', [authJwt.verifyToken], controller.userContent);
	
	//app.get('/api/test/pm', [authJwt.verifyToken, authJwt.isPmOrAdmin], controller.managementBoard);
	
	//app.post('/api/test/admin',  controller.adminBoard);

	//app.post('/sendEmail', controller.send);

	app.get("/all", controller.findAll);

	//app.get("/:id", [authJwt.verifyToken, authJwt.isPm], controller.findOne);
	
	//app.get("/:id", [authJwt.verifyToken, authJwt.isPm], controller.findOne);
	
	//app.get("/allUser", controller.findAll);     

}