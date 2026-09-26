const capitalize = (str) => {
    const [first, ...rest] = str;
    return `${first.toUpperCase()}${rest.join('')}`;
};

console.log(capitalize('fooBar'));
console.log(capitalize('nodeJs'));
