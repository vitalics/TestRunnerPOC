const { EventEmitter } = require('events');

const reporter = new EventEmitter();
reporter.on('suite start', () => {
    console.log('suite start');
});
reporter.on('suite fail', () => {
    console.log('suite fail');
});
reporter.on('suite end', () => {
    console.log('suite end');
});
reporter.on('test start', (name) => {
    console.log('test start by name', name);
});
reporter.on('test fail', () => {
    console.log('test fail');
});
reporter.on('test end', () => {
    console.log('test end');
});
module.exports = { reporter };