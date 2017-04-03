var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Server - Tweets', function() {

	//Test if tweets loaded.
	it('should list tweets on /page/:page/:current GET', function(done){
		chai.request(server)
			.get('/page/0/' + new Date())
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('array');
	        res.body.length.should.be.eql(0);
				done();
			})
	});

	//Test if tweets not to load if link lacks of params 
	it('should not load tweets on /page/:page/:current GET without :current params', function(done){
		chai.request(server)
			.get('/page/0/')
			.end(function(err, res){
				res.should.have.status(404);
				done();
			})
	});

	//Test if main page loaded  
	it('should load main page at "/"', function(done){
		chai.request(server)
			.get('/')
			.end(function(err, res){
				res.should.have.status(200);
				done();
			})
	});
});
