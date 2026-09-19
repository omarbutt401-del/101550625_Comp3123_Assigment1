const { execSync } = require('child_process');

const exercises = [
  'exercise1.js',
  'exercise2.js',
  'exercise3.js',
  'exercise4.js',
  'exercise5.js',
  'exercise6.js'
];

console.log('=== Running 3123 Lab 2 Exercises===\n');

exercises.forEach((file) => {
  console.log(`----------------------------------------`);
  console.log(`▶ Executing: ${file}`);
  console.log(`----------------------------------------`);
  try {
    execSync(`node ${file}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error  ${file}`);
  }
  console.log('\n');
});

console.log('=== All exercises completed ===');