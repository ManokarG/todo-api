const Sequelize=require('sequelize');
const env=process.env.NODE_DEV||'development';
var sequelize;
if(env==='production'){
sequelize=new Sequelize(process.env.DATABASE_URL,{
	'dialect':'postgres'
});
}else{
sequelize=new Sequelize(undefined,undefined,undefined,{
	'dialect':'sqlite',
	'storage':__dirname+'/data/db-sqlite-api.sqlite'
});
}

const db={};

db.todo=sequelize.import(__dirname+'/models/todo.js');
db.user=sequelize.import(__dirname+'/models/user.js');
db.token=sequelize.import(__dirname+'/models/token.js');
db.sequelize=sequelize;
db.Sequelize=Sequelize;

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

module.exports=db;