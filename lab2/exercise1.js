const gretter = (myArray, counter) => {
    const greetText = 'Hello ';
    
    for (const item of myArray) {
        console.log(`${greetText}${item}`);
    }
};

gretter(['Randy Vob', 'Fahir Flair', 'Hulk Hogan'], 3);
