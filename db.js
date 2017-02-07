const Sequelize=require('sequelize');
const env=process.env.NODE_DEV||'development';
if(env=='production'){
const sequelize=new Sequelize(process.env.DATABASE_URL,{
	'dialect':'postgres',
	'storage':__dirname+'/data/db-sqlite-api.sqlite'
});
}else{
const sequelize=new Sequelize(undefined,undefined,undefined,{
	'dialect':'sqlite',
	'storage':__dirname+'/data/db-sqlite-api.sqlite'
});
}

const db={};

db.todo=sequelize.import(__dirname+'/models/todo.js');
db.sequelize=sequelize;
db.Sequelize=Sequelize;

module.exports=db;