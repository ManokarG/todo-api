var etUsername,etEmail,etPassword,etConfirmPassword,tvUsernameError,tvEmailError,tvPasswordError,tvConfirmPassError;

window.onload=function(e){
	etUsername=document.getElementById('username');
	etEmail=document.getElementById('email');
	etPassword=document.getElementById('password');
	etConfirmPassword=document.getElementById('confirmPassword');
	tvUsernameError=document.getElementById('tvUsernameError');
	tvEmailError=document.getElementById('tvEmailError');
	tvPasswordError=document.getElementById('tvPasswordError');
	tvConfirmPassError=document.getElementById('tvConfirmPassError');
	etUsername.addEventListener('input',inputUsernameChangeListener);
	etEmail.addEventListener('input',inputEmailChangeListener);
	etPassword.addEventListener('input',inputPasswordChangeListener);
	etConfirmPassword.addEventListener('input',inputConfirmPasswordChangeListener);
}

function inputUsernameChangeListener(){
	hideDiv(tvUsernameError);
}

function inputEmailChangeListener(){
	hideDiv(tvEmailError);
}

function inputPasswordChangeListener(){
	hideDiv(tvPasswordError);
}

function inputConfirmPasswordChangeListener(){
	hideDiv(tvConfirmPassError);
}

function register(){
	
	hideDiv(tvEmailError);
	hideDiv(tvPasswordError);

if(etUsername.value===''){
		tvUsernameError.textContent='Please enter username';
		showDiv(tvUsernameError);
		return;
	}

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

	if(etConfirmPassword.value===''){
		tvConfirmPassError.textContent='Please enter confirm password';
		showDiv(tvConfirmPassError);
		return;
	}

	if(etPassword.value!==etConfirmPassword.value){
	tvConfirmPassError.textContent='Password and confirm password does not match';
		showDiv(tvConfirmPassError);
		return;
	}


var xar=new XMLHttpRequest();
xar.open("POST","/users",true);
xar.setRequestHeader('Content-Type','application/json');
var data=JSON.stringify({
	'email':etEmail.value,
	'password':etPassword.value,
	'username':etUsername.value

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