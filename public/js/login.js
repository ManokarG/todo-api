
var btnLogin,btnRegister,etEmail,etPassword,tvEmailError,tvPasswordError;
window.onload=function(e){
	btnLogin=document.getElementById('login');
	btnRegister=document.getElementById('register');
	etEmail=document.getElementById('email');
	etPassword=document.getElementById('password');
	tvEmailError=document.getElementById('tvEmailError');
	tvPasswordError=document.getElementById('tvPasswordError');
	btnLogin.addEventListener('click',login);
	etEmail.addEventListener('input',inputEmailChangeListener);
	etPassword.addEventListener('input',inputPasswordChangeListener);
	btnRegister.addEventListener('click',register);
}

function register(){
	window.location="register.html";
}

function inputEmailChangeListener(){
	hideDiv(tvEmailError);
}

function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function inputPasswordChangeListener(){
	hideDiv(tvPasswordError);
}

function hideDiv(element){
	element.classList.add('hide');
}

function showDiv(element){
	element.classList.remove('hide');
}


function login(){
	hideDiv(tvEmailError);
	hideDiv(tvPasswordError);
	if(etEmail.value===''){
		showDiv(tvEmailError);
		return;
	}

	if(!validateEmail(etEmail.value)){
		showDiv(tvEmailError);
		return;
	}

	if(etPassword.value===''){
		showDiv(tvPasswordError);
		return;
	}


var xar=new XMLHttpRequest();
xar.open("POST","/users/login",true);
xar.setRequestHeader('Content-Type','application/json');
var data=JSON.stringify({
	"email":etEmail.value,
	"password":etPassword.value
});
xar.onreadystatechange=function(){
	if(xar.readyState==4&&xar.status==200){
		var response=JSON.parse(xar.responseText);
		if(response.status==='error'){
			a('Login Error');
		}else{
			window.location="/todo.html";
		}
	}
}
xar.send(data);
}

function a(message){
	alert(message);
}