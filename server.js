const express=require('express');
const app=express();
const PORT=process.env.PORT||8888;

app.get('/',function(req,res){
res.senc("Todo API root detected");
});

app.listen(PORT,function(){
console.log(` Server listening on port ${PORT}`);
});