
var etEmail,etPassword,tvEmailError,tvPasswordError;

window.onload=function(e){

	if(getPrefs('login')==1){
		window.location='/todo.html';
		return;
	}

	etEmail=document.getElementById('email');
	etPassword=document.getElementById('password');
	tvEmailError=document.getElementById('tvEmailError');
	tvPasswordError=document.getElementById('tvPasswordError');
	etEmail.addEventListener('input',inputEmailChangeListener);
	etPassword.addEventListener('input',inputPasswordChangeListener);
}

function register(){
	redirect('register.html');
}

function inputEmailChangeListener(){
	hideDiv(tvEmailError);
}

function inputPasswordChangeListener(){
	hideDiv(tvPasswordError);
}


function login(){
	hideDiv(tvEmailError);
	hideDiv(tvPasswordError);
	if(etEmail.value===''){
		tvEmailError.textContent='Please enter email';
		showDiv(tvEmailError);
		return;
	}

	if(!validateEmail(etEmail.value)){
		tvEmailError.textContent='Please enter valid email';
		showDiv(tvEmailError);
		return;
	}

	if(etPassword.value===''){
		tvPasswordError.textContent='Please enter password';
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
		a(response.message);
		if(response.status==='error'){
		}else{
			setPrefs('login',1);
			setPrefs('username',response.user.username);
			redirect("/todo.html");
		}
	}
}
xar.send(data);
}