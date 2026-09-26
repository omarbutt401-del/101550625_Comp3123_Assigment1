const array = [1, 2, 3, 4];

const calculateSum = array.reduce((accumulator, current) => accumulator + current, 0);
const calculateProduct = array.reduce((accumulator, current) => accumulator * current, 1);

console.log(calculateSum);
console.log(calculateProduct);