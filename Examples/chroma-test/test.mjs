import chroma from 'chroma-js';

let scale = chroma.scale(['white', 'red']).mode('lab');
scale.domain([0.0,0.0]);
console.log(scale(0.5).hex());
console.log('Test');