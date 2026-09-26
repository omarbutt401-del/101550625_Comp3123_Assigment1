/*
Purpose: Review JS concepts
Prototypes vs Classes
regular functions, anonymous functions, arrow functions
callback functions
MERN, N stamds dore Node.js
*/

// var is global scope vs let is local scope
var globalVariable = 100;
let localVariable = 200;

function functionName() {
    let varinfunc = "local"

}
// console.log(varinfunc);  // will fail

// Prototype - one time use object from a prototype
const oneTimeUseObj = {
    prop1: "Omar",
    prop2: "COMP3123",
    method1: function(param1) {
        console.log(param1)
    }

}

console.log(oneTimeUseObj)
console.log(oneTimeUseObj.prop1)
console.log(oneTimeUseObj.prop2)
oneTimeUseObj.method1("Pizza")

// Prototype - using a coonstructor
function Student(student_name_p, course_p, lunch_p) {
    this.student_name = student_name_p;
    this.course = course_p;
    this.lunch = lunch_p;
    this.method1 = function(param1) {
        return param1
    }
}

const morning_student = new Student("Omar", "comp3123", "noodles");
console.log(morning_student)
console.log(morning_student.student_name)
console.log(morning_student.course)
console.log(morning_student.method1(morning_student.lunch))

// Classes - always have constructors 
class Prof{
    constructor(prof_name_p){
        this.prof_name = prof_name_p;
    }
    method1(lunch){
        console.log(lunch)
    }
}

morning_prof = new Prof("laily");
console.log(morning_prof.prof_name)
morning_prof.method1("burger")

// Optional Homework: Practice a callback function using an array and the .map() function