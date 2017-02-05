const express=require('express');
const app=express();
const PORT=process.env.PORT||8888;

app.get('/',function(req,res){
res.redirect("www.google.com");
});

app.listen(PORT,function(){
console.log(` Server listening on port ${PORT}`);
});