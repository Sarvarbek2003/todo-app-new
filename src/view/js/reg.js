let login = document.querySelector('#login')
let parol = document.querySelector('#parol')
let select = document.querySelector('#select')
let birthday = document.querySelector('#birthday')
let btn = document.querySelector('#userAdd')

let ID = +(window.localStorage.getItem('token'))
if(ID){
    window.location.assign('/')
}
btn.onsubmit = async event => {
    event.preventDefault()
	let newUser = {
		username: login.value,
		parol: parol.value,
		gender: select.value,
		birthday: birthday.value
	}

	let res = await request('/register', 'POST', newUser)
	console.log(res)
	if (res.message == "OK"){
		window.localStorage.setItem('token', res.id)
		window.location.assign('/')
	}
	else{
		alert(res.message)
	}

	login.value = null
	parol.value = null
	birthday.value = null
}