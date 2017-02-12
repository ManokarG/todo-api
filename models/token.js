var crypto=require('crypto-js');
module.exports=function(sequelize,DataType){
	return sequelize.define('token',{
		token:{
			type:DataType.STRING,
			allowNull:false,
			set:function(value){
				var hash=crypto.MD5(value).toString();
				this.setDataValue('token',value);
				this.setDataValue('tokenhash',hash);
			}
		},
			tokenhash:DataType.STRING
	});
}