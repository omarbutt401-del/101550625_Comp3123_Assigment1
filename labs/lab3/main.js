/*
Purpose: Create multiple server paths to access
users
userlist
name
*/

let http = require("http")
let fs = require("fs")
let users = require("./data.js")
let employeeMod = require("./employeeModule.js")

const PORT = 8088

const server = http.createServer( (request, response) => {

        if (request.url == "/"){
        // Properly set response headers for JSON and HTML content.
        response.writeHead(200, {"Content-Type": "text/html"})
        response.write("<h1>NodeJS Web Server at the root</h1>")
        response.write("<p>Welcome to the root path at the server</p>")
        response.end()
        }
        else if (request.url == "/users") {
        // Convert from JSON obj to JSON string
        let data = JSON.stringify(users) // Is this deep enough
        response.write(data)
        response.end ()
        }
        else if (request.url == "/name") {
        response.writeHead(200,{"Content-Type": "text/html"})
        response.write("<article>Laily Ajellu</article>")
        response.end()
        }
        else if (request.url == "/userlist") {
                fs.readFile(__dirname + "/employees.json", "utf-8", (error, data) => {
                response.write(data)
                response.end()
                })
        }
        //employee returns all employee details.
        else if (request.url == "/employee") {
                response.writeHead(200, {"Content-Type": "application/json"})
                let allEmployees = employeeMod.getAllEmployees()
                response.write(JSON.stringify(allEmployees))
                response.end()
        }
        //employee/names returns employee full names in ascending order.
        else if (request.url == "/employee/names") {
                response.writeHead(200, {"Content-Type": "application/json"})
                let namesList = employeeMod.getEmployeeNames()
                response.write(JSON.stringify(namesList))
                response.end()
        }
        //employee/totalsalary returns the total salary of all employees.
        else if (request.url == "/employee/totalsalary") {
                response.writeHead(200, {"Content-Type": "application/json"})
                let total = employeeMod.getTotalSalary()
                response.write(JSON.stringify({ total_salary: total }))
                response.end()
        }
})

server.listen(PORT)
console.log(`Server started at port number : ${PORT}`)
