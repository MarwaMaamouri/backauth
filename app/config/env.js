const env = {
  database: 'testdb',
  username: 'postgres',
  password: 'root',
  host: 'localhost',
  dialect: 'postgres',
//CLIENT_URL = 'http://localhost:8080',
//RESET_PASSWORD_KEY='468bde97-c28b28ad',
//JWT_ACC_ACTIVATE='468bde97-c28b28ad',
 
  pool: {
	  max: 5,
	  min: 0,
	  acquire: 30000,
	  idle: 10000
  },
  
  mailer: {
    auth: {
      user: 'test@example.com',
      pass: 'secret',
    },
    defaultFromAddress: 'First Last <test@examle.com>'
  }

};

module.exports = env;

