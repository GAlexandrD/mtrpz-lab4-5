# Task Manager
To use this app you need [Node.JS](https://nodejs.org/en/download) installed on your machine

## Setup instruction
install dependencies
```
npm install
```
build app
```
npm run build
```
usage 
```
node taskmanager [command] [args]
```

## Available commands
create new task:
```
node taskmanager create -n [task name] -d [YYYY-MM-DD] -i [description]
```
edit existing task:
```
node taskmanager edit -n [task name] -e [new name] -d [new deadline] -i [new description]
```
show all tasks
```
node taskmanager show-all
```
show tasks which was done later than deadline
```
node taskmanager show-omited
```
show undone tasks
```
node taskmanager show-undone
```
mark task as done
```
node taskmanager markdone -n [task name]
```
remove task
``` 
node taskmanager remove -n [task name]
```
## In all commands where with args:
-n required <br>
-e, -d, -i  optional
