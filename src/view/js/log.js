form.onsubmit = async (event) => {
    event.preventDefault()
    let ID = +(window.localStorage.getItem('token'))
    if(ID){
        window.location.assign('/')
    }
    let res = await request('/users')
    let data = res.find(user => {
        if (user.username.toLowerCase() == login.value.toLowerCase() && user.parol == parol.value){
            window.localStorage.setItem('token', user.userId)
            window.location.assign('/')
            login.value = null
            parol.value = null
            return 2
        }
    });
    if ( data  == undefined ){
        alert("login va parol hato malumotlarni tekshirib ko`ring yoki ro`yhatdan o`ting")
    }else{
        let res = await request('/users', 'PUT',{
            userId: window.localStorage.getItem('token'),
            online: true
        })
    }
}
