const fs = require('fs');
const path = require('path');
// console.log(process.argv[2]);
let todo;
// initialise database
try {
    fs.statSync(path.join(__dirname,"/todo/database.json"));
    todo = JSON.parse(fs.readFileSync(path.join(__dirname,'todo/database.json'), 'utf8'));
} catch (error) {
    fs.writeFileSync(path.join(__dirname,"/todo/database.json"),JSON.stringify(JSON.parse("[]")));
    todo = JSON.parse(fs.readFileSync(path.join(__dirname,'todo/database.json'), 'utf8'));
}
const addTodo = (todo) => {
 let existingTodo = JSON.parse(fs.readFileSync(path.join(__dirname,'todo/database.json'), 'utf8'));
 existingTodo.push({task: todo, completed: false});
 fs.writeFileSync(path.join(__dirname,"/todo/database.json"),JSON.stringify(JSON.parse(JSON.stringify(existingTodo))));
}   

const listTodo = ()=>{
    return JSON.parse(fs.readFileSync(path.join(__dirname,'todo/database.json'), 'utf8'));
}
process.stdout.write(`
Docummentation:
To add todo: run "add description of todo"
To view todo list: run "list todo" or "list"
To delete a todo: run "del the serial number of the todo"
To move a todo to completed: run "complete the serial number of the todo"
To move a todo to pending: run "pending the serial number of the todo"
To quit the todo applicatiion: press Control+C on your keyboard
`)
process.stdout.write(" > ")
process.stdin.on('data', data=>{
    if(data.toString().includes('list')){
        let todos = listTodo();
        let todoList = '\n';
        for(let i = 0; i < todos.length; i++){
            todoList += `(${i+1}${todos[i]?.completed? '*': ''}) ${todos[i]?.task} \n`
        }
        process.stdout.write(`\n ${todoList}`);
    }
    // add a todo
   else if(data.toString().includes('add') || data.toString().includes('Add')){
       let newTodo = data.toString().split(' ').slice(1);
        addTodo(newTodo.join(' ').trim());
    }
    // delete a todo
   else if(data.toString().includes('del')){
        let todos = listTodo();
        let todoId  = data.toString().split(' ').slice(1);
        todoId = todoId.join(' ').trim();
        todos.splice(todoId-1,1);
        fs.writeFileSync(path.join(__dirname,"/todo/database.json"),JSON.stringify(JSON.parse(JSON.stringify(todos))));
    }
    // complete a todo
    else  if(data.toString().includes('complete')){
        let todos = listTodo();
        let todoId  = data.toString().split(' ').slice(1);
        todoId = todoId.join(' ').trim();
        todos.splice(todoId-1,1,{...todos[todoId-1], completed: true});
        fs.writeFileSync(path.join(__dirname,"/todo/database.json"),JSON.stringify(JSON.parse(JSON.stringify(todos))));
    }
    // move a todo to pending
    else  if(data.toString().includes('pending')){
        let todos = listTodo();
        let todoId  = data.toString().split(' ').slice(1);
        todoId = todoId.join(' ').trim();
        todos.splice(todoId-1,1,{...todos[todoId-1], completed: false});
        fs.writeFileSync(path.join(__dirname,"/todo/database.json"),JSON.stringify(JSON.parse(JSON.stringify(todos))));
    }
    // see list of available commands
    else  if(data.toString().includes('commands')){
        process.stdout.write(`
                Docummentation:
                To add todo: run "add description of todo"
                To view todo list: run "list todo" or "list"
                To delete a todo: run "del the serial number of the todo"
                To move a todo to completed: run "complete the serial number of the todo"
                To move a todo to pending: run "pending the serial number of the todo"
                To quit the todo applicatiion: press Control+C on your keyboard
                `)
    }else{

        process.stdout.write(`
        command: ${data.toString().trim()} not found
        Please type 'commands' to see the list of commands available
        `);
    }
    // process.exit();
})