const express=require('express');
const app=express();
const PORT=process.env.PORT||8888;

const todos=[{
		id:1,
		description:"http://www.google.com",
		completed:true
	},{
		id:2,
		description:"http://www.yahoo.com",
		completed:false
	},{
		id:3,
		description:"http://www.youtube.com",
		completed:true
	},{
		id:4,
		description:"http://www.facebook.com",
		completed:false
	}]

app.get('/',function(req,res){
	res.send("Todo API root detected");
});

app.get('/todos',function(req,res){
	var todo={
		status:"success",
		todos:todos
	}
	res.json(todo);
});

app.get('/todo/:id',function(req,res){

	var response={};

	const id=parseInt(req.params.id,10);

	var matchedTodo;

	todos.forEach(function(data){

			if(data.id===id){
				matchedTodo=data;
			}

	});

	if(matchedTodo){
		response.status="success";
		response.todo=matchedTodo;
	}else{
		response.status="error";
		response.todo={};
		res.status(404);
	}

	res.json(response);

});

app.listen(PORT,function(){
console.log(` Server listening on port ${PORT}`);
});