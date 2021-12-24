// const { request } = require("express")

let list = document.querySelector('.list')
let mainTodo = document.querySelector('.main_todo ul')
let mainDoing = document.querySelector('.main_doing ul')
let mainDone = document.querySelector('.main_done ul')
let plus = document.querySelector('.todos_head .span1')
let logOut = document.querySelector('.todos_head .span2')
let h1 = document.querySelector('.todos_head h1')


let SESSION = window.localStorage.getItem('session') ? JSON.parse(window.localStorage.getItem('session')).session : '{}'
h1.textContent = window.localStorage.getItem('session') ? JSON.parse(window.localStorage.getItem('session')).name : 'Name'

let ID = +(window.localStorage.getItem('token'))
if(!ID){
    window.location.assign('/register')
}


function createElements(...array){
    return array.map(el => document.createElement(el))
}

if(ID == SESSION){
    plus.onclick = () => {
        plusTodo(ID)
    } 
}

async function renderUser(){
    let users = await request('/users', "GET")
    users.forEach(user => {
        if (!user.online) return
        let [li] = createElements('li')
        li.textContent = user.username
        list.append(li)
        li.addEventListener('click', ell => {
            window.localStorage.setItem('session', JSON.stringify({session:user.userId, name: user.username}),)
            renderTodos(user.userId)
            plus.onclick = () => {
                plusTodo(user.userId)
            } 
            h1.textContent = user.username
            mainTodo.innerHTML = null
            mainDoing.innerHTML = null
            mainDone.innerHTML = null
        })
    })
}



function plusTodo (arg){
    if( ID != arg ) return
    window.location.assign('/addTodo')
}


logOut.onclick = async(event) => {
    let ob = {
        userId: ID,
        online: false
    }
    let res = await request('/users', 'PUT', ob)
    window.localStorage.setItem('token', '')
    window.location.assign('/login')
}

async function renderTodos(arg){
    let todos = await request('/todos', "GET")
    todos = todos ? todos : []

    let arr = todos.find(todo => todo.userId == arg )  
    if (!arr) {
        mainTodo.innerHTML = null
        mainDoing.innerHTML = null
        mainDone.innerHTML = null
        return
    }
    arr.todos.forEach(todo => {
        let [li,span,p,span2,select,option1,option2,option3] = createElements('li','span','p','span','select','option','option','option')
        
        option1.textContent = "Todo"
        option2.textContent = "Doing"
        option3.textContent = "Done"

        option1.value = "todo"
        option2.value = "doing"
        option3.value = "done"

        if( ID == arg ) {
            select.removeAttribute('disabled','disabled')
        }else{
            select.setAttribute('disabled', 'disabled')
        }

        span.textContent = todo.title
        p.textContent = todo.text
        span2.textContent = todo.time
        select.append(option1,option2,option3)
        li.append(span,p,span2,select)
        li.setAttribute('name',todo.todoId) 

        if(todo.todo){
            option1.selected = true
            mainTodo.append(li)
        }else if(todo.doing){
            option2.selected = true
            mainDoing.append(li)
        }else if(todo.done){
            option3.selected = true
            mainDone.append(li)
        }
        li.onchange = () => {
            editTodo(todo.todoId,select.value)
        }
    }) 
}

async function editTodo(id,arg){
    let todo = arg == 'todo' ? "todo" : false
    let doing = arg == 'doing' ? "doing" : false
    let done = arg == 'done' ? "done" : false
    let reques = todo || doing || done
    if (SESSION != ID) return
    let obj = {
        userId: ID,
        todoId: id,
        [reques]: true
    }
    let todos = await request('/todos', "PUT",obj)
    if(todos.message == "OK") {
        mainTodo.innerHTML = null
        mainDoing.innerHTML = null
        mainDone.innerHTML = null
        renderTodos(SESSION)
    }
}

renderTodos(SESSION)
renderUser()