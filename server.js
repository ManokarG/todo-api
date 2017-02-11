const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const db = require('./db.js');
const middleware=require('./middleware.js')(db);
const todo_router=require('./routes/todo_route.js')(db,express);
const user_router=require('./routes/user_route.js')(db,express);
const app = express();
const PORT = process.env.PORT || 8888;
const wantToReload=false;

var todoNextId = 5;

app.use(bodyParser.json());

app.use('/users',user_router);
app.use('/todos',middleware.requireAuthentication,todo_router);

app.get('/', function(req, res) {
	res.send("Todo API root detected");
});

var reload={};
if(wantToReload){
	reload.force=true
}
db.sequelize.sync(reload).then(function() {
	app.listen(PORT, function() {
		console.log(` Server listening on port ${PORT}`);
	});
});