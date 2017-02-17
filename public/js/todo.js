window.onload=function(){

	if(getPrefs('login')!=1){
		window.location='/';
		return;
	}

	var username=document.getElementById('username');
	username.textContent=getPrefs('username');
}

function logout(){
	setPrefs('login',0);
	redirect('/');
}