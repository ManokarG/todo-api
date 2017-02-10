module.exports= function(db){
	return {
	requireAuthentication:function(req,res,next){
		var header=req.get('Auth');

		db.user.findByToken(header).then(function(user){

req.user=user;
next();

		},function(e){
			console.log(e);
			res.status(404).send();
		});
	}
	};
};