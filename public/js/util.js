function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function hideDiv(element){
	element.classList.add('hide');
}

function showDiv(element){
	element.classList.remove('hide');
}

function redirect(path){
	window.location=path;
}

function getPrefs(key){
	return localStorage.getItem(key);
}

function setPrefs(key,value){
	return localStorage.setItem(key,value);
}

function a(message){
	alert(message);
}