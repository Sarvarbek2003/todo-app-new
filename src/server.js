const express = require("express")
const fs = require("fs")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 9009

let d = new Date()



let times = `${d.getHours()}:${d.getMinutes()}`

app.use( express.json() )
app.use(express.static(path.join(__dirname, 'view')));


app.get('/', (req, res) => {
	const file = fs.readFileSync( path.join(__dirname, 'view', 'index.html') )
	res.writeHead(200, { 'Content-Type': 'text/html' })
	return res.end(file)
})

app.get('/login', (req, res) => {
	const file = fs.readFileSync( path.join(__dirname, 'view', 'login.html') )
	res.writeHead(200, { 'Content-Type': 'text/html' })
	return res.end(file)
})

app.get('/register', (req, res) => {
	const file = fs.readFileSync( path.join(__dirname, 'view', 'reg.html') )
	res.writeHead(200, { 'Content-Type': 'text/html' })
	return res.end(file)
})

app.get('/addTodo', (req, res) => {
	const file = fs.readFileSync( path.join(__dirname, 'view', 'addTodo.html') )
	res.writeHead(200, { 'Content-Type': 'text/html' })
	return res.end(file)
})




app.get('/users', (req, res) => {
    let users = fs.readFileSync( path.join(__dirname, 'database', 'users.json'), 'UTF-8' )
    res.send(users)
})
app.get('/todos', (req, res) => {
    let todos = fs.readFileSync( path.join(__dirname, 'database', 'todos.json'), 'UTF-8' )
    res.send(todos)
})

app.post('/register', (req, res) => {
    // username
    // parol
    // gender
    // birthday
    try {
        let users = fs.readFileSync( path.join(__dirname, 'database', 'users.json'), 'UTF-8' )
        let usersJ = JSON.parse(users)
        function nameParolCheck() {
            if (!(req.body.username.length < 15 && req.body.username.length > 3) || req.body.username.includes(' ')) return 1
            let k = usersJ.find( user => {
                if (user.username.toLowerCase() == req.body.username.toLowerCase()) return 2
            })
            if (k) return 2
        }
        if(nameParolCheck() == 1) return res.json( {message: 'Username 3 tadan 15 ta belgi va orada boshliqsiz bolishi shart!'})
        if(nameParolCheck() == 2) return res.json({message:'Bunday username mavjud!'})
        if(!(parolCheck(req.body.parol)) || !(req.body.parol.length > 7)) return res.json( {message: "Parolning uzunligi 8dan katta va raqam hamda katta kichik harflar bilan birga belgilar ishtirok etishi kerak"} )
        if(!(typeof req.body.birthday === 'string') || !(req.body.birthday.length == 4) || !(req.body.birthday > 1936 && 2022 > req.body.birthday)) return res.json({ message: 'Tug`ilgan yilingiz mos tushmadi'})
        if (parolCheck(req.body.parol) == true) {
            let userObj ={}
            userObj = {
                userId: usersJ.length + 1,
                username: req.body.username,
                parol: req.body.parol,
                gender: req.body.gender,
                birthday: req.body.birthday,
                online: true
            }
            usersJ.push(userObj)
            fs.writeFileSync( path.join(__dirname, 'database', 'users.json'), JSON.stringify(usersJ, null, 4) )
            res
                .json({ message: 'OK', id: usersJ.length })
                .status(201)
        } else {
            res
            .json({ message: 'There are errors in the parameters!' })
        }
    } catch (error) {
        res.send('saom')
    }
})

app.post('/todos', (req, res) => {
    // userId
    // title
    // text
    try {
        let todoss = fs.readFileSync( path.join(__dirname, 'database', 'todos.json'), 'UTF-8' )
        let todosJ = todoss ? JSON.parse(todoss) : []
        if( !(typeof req.body.title === 'string') || req.body.title.length < 20 ) return res.json({message:'Invalid title'})
        if( !(typeof req.body.text === 'string') || req.body.text.length < 100 ) return res.json({message: 'Invalid text'})
        let todoUser = todosJ.find(todo => +todo.userId == +req.body.userId) 
        if(!todoUser) {
            newobj = {}
            newobj.userId = +req.body.userId
            newobj.todos = []
            let newTodo = {
                todoId: 1,
                title: req.body.title,
                text: req.body.text,
                time: times,
                todo: true,
                doing: false,
                done: false
            }
            newobj.todos.push(newTodo)
            todosJ.push(newobj)
        }else{
            let newTodo = {
                todoId: todoUser.todos.length + 1,
                title: req.body.title,
                text: req.body.text,
                time: times,
                todo: true,
                doing: false,
                done: false
            }
            todoUser.todos.push(newTodo)
        }

        fs.writeFileSync( path.join(__dirname, 'database', 'todos.json'), JSON.stringify(todosJ, null, 4))
        res
            .json({ message: 'OK' })
            .status(201)
    } catch (error) {
        res.send(error.message)
    }
})

app.put('/users', (req, res) => {
    // userId
    // online
    try {
        let users = fs.readFileSync( path.join(__dirname, 'database', 'users.json'), 'UTF-8' )
        let usersJ = JSON.parse(users)
        if (req.body.online == true || req.body.online == false) {
            let putUser = usersJ.find(user => user.userId == req.body.userId)
            putUser.online = req.body.online
            fs.writeFileSync( path.join(__dirname, 'database', 'users.json'), JSON.stringify(usersJ, null, 4))
            res
                .json({ message: 'OK' })
                .status(201)
        }
    } catch (error) {
        res.send(error.message)
    }
})

app.put('/todos', (req, res) => {
    // userId
    // todoId
    // todo
    // doing
    // done
    try {
        let todoss = fs.readFileSync( path.join(__dirname, 'database', 'todos.json'), 'UTF-8' )
        let todosJ = JSON.parse(todoss)
        if (req.body.userId) {
            let todoPost = todosJ.find(todoJ => (todoJ.userId == req.body.userId))
            let findTodo = todoPost.todos.find(todo => +todo.todoId == +req.body.todoId )
            findTodo.todo = req.body.todo ? req.body.todo : false
            findTodo.doing = req.body.doing ? req.body.doing : false
            findTodo.done = req.body.done ? req.body.done : false
            fs.writeFileSync(path.join(__dirname, 'database', 'todos.json'), JSON.stringify(todosJ, null, 4))
            res
                .json({ message: 'OK' })
                .status(201)
        } else {
            res
                .json({ message: 'There is an error!' })
        }
    } catch (error) {
        res.send(error.message)
    }
})


function parolCheck(pass) {
    let count = 0
    let  result = 0
    for (let i of pass) {
        if (i.match(/[a-z]/)) count++
    }
    if (count > 0) {
        result++
        count = 0
    }
    for (let i of pass) {
        if (i.match(/[A-Z]/)) count++
    }
    if (count > 0) {
        result++
        count = 0
    }
    for (let i of pass) {
        if (i.match(/[0-9]/)) count++
    }
    if (count > 0) {
        result++
        count = 0
    }
    for (let i of pass) {
        if (i.match(/[!,@,#,$,%,&,*]/)) count++
    }
    if (count > 0) {
        result++
        count = 0
    }
    if (result >= 4) return true
    else return false
}

app.listen(PORT, () => console.log('Server is running on http://localhost:' + PORT))
