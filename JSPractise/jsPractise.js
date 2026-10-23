// function statement known as function declaration
function a() {
  console.log("a");
}

// function expression
var b = function () {
  console.log("b");
};

// * Diff between function statement and function expression
// During memory creation phase a is created in memory andy function is assigned to a. For function expression, b is treated as a varibale and assign the undefine until the that partiuclar line execute and then assign that function to b.

// anonymous function
// it will throw error syntax error and when it will use, use can assign anonymous function to varibale and acts like a value
// function () {}

// named function expression
var c = function xyz() {
  console.log("b");
};
// c(); // executed
// xyz(); // throw refrenace error - becasue xyz function not created in global scrop but it is created as a local varibale - like console.log(xyz) in xyz function

// differance between paramaters & arguments
function p(param1, param2) {
  console.log(param1, param2);
} // param , 2 known as paramaters
// p(2, 5); // 2,5 known as arguments

// first class function
// the ability to functions to be use as value, pass in argument to another function and return the function known as first class function
var u = function (param1) {
  return function o() {};
};
// console.log(u());

// higher order function
// map, filter, reduce are higher order function
// below calculate() almost similar to map
const radius = [3, 4, 7, 8];

const area = function (radius) {
  return Math.PI * radius * radius;
};

const diameter = function (radius) {
  return 2 * Math.PI * radius;
};

const calculate = function (radius, loigcFn) {
  const result = [];
  for (var i = 0; i < radius.length; i++) {
    result.push(loigcFn(radius[i]));
  }
  return result;
};

// console.log("area", calculate(radius, area));
// console.log("diameter", calculate(radius, diameter));

//
const peopleList = [
  { firstName: "Amit", lastName: "Mehta", age: 10 },
  { firstName: "Sanya", lastName: "Gupta", age: 11 },
  { firstName: "Arjun", lastName: "Rao", age: 18 },
  { firstName: "Isha", lastName: "Choudhury", age: 13 },
  { firstName: "Aditya", lastName: "Mishra", age: 14 },
  { firstName: "Riya", lastName: "Shah", age: 15 },
  { firstName: "Dev", lastName: "Desai", age: 16 },
  { firstName: "Kavya", lastName: "Reddy", age: 15 },
  { firstName: "Vivaan", lastName: "Kapoor", age: 18 },
  { firstName: "Anjali", lastName: "Saxena", age: 18 },
];
// 1.  output should: {11:1, 10:1, 12:1,13:1}

const result = peopleList.reduce((acc, curr) => {
  if (acc[curr.age]) {
    acc[curr.age]++;
  } else {
    acc[curr.age] = 1;
  }
  return acc;
}, {});

// console.log("result", result);

// 2. first name all the people whos age is less then 18

const res1 = peopleList.filter((o) => o.age < 15).map((x) => x.firstName);
// console.log("res1", res1);

const res = peopleList.reduce((acc, curr) => {
  if (curr.age < 15) acc.push(curr.firstName);
  return acc;
}, []);
// console.log("res", res);

const numbers = [10, 20, 30];

const op = numbers.reduce((acc, current) => {
  return acc + current;
});

// console.log(op);

// --------------- structuredClone() and JSON.stringify() / JSON.parse(
const original = {
  name: "Rahul",
  age: 28,
  date: new Date(),
  hobbies: ["coding", "gaming"],
  address: {
    city: "Ahmedabad",
    state: "Gujarat",
  },
  skills: {
    frontend: ["React", "JavaScript"],
    backend: ["Node.js", "Express"],
  },
  setting: new Map([["theme", "dark"]]),
};

const shallowCopyObj = { ...original };
// const shallowCopyObj = JSON.parse(JSON.stringify(original));
// const shallowCopyObj = structuredClone(original);
shallowCopyObj.address.city = "Mumbai";
// console.log("original", original);
// console.log("shallowCopyObj", shallowCopyObj);

/*-------------------Event delegation-----------------*/

// document.getElementById("parent").addEventListener("click", function (e) {
//   if (e.target.classList.contains("btn")) {
//     console.log("Clicked on", e.target.innerText);
//   }
// });

const mapDouble = radius.map((o) => o * 2);
const foreachRes = [];
const foreachDouble = radius.forEach((o) => foreachRes.push(o * 2));
// console.log("radius", radius);
// console.log("mapD", mapDouble);
// console.log("foreachD", foreachDouble);
// console.log("foreachRes", foreachRes);

/*-------------------slice and splice-----------------*/
const n = [10, 20, 12, 32, 45, 40];
console.log("slice", n.slice(1, 3));
// console.log("splice", n.splice());
console.log("n", n);
