let input_title = document.querySelector('.input_title')
let input_todo = document.querySelector('.input_todo')

let button = document.querySelector('button')

let ID = +(window.localStorage.getItem('token'))
let SESSION = JSON.parse(window.localStorage.getItem('session')).session 

if(!ID){
    window.location.assign('/login')
}

button.onclick = async () => {
    if( ID != SESSION ) return
    let newTodo = {
        userId : ID,
        title : input_title.value,
        text : input_todo.value
    }
    input_title.value = null
    input_todo.value = null
    let todos = await request('/todos', "POST", newTodo)
}
