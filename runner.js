const fs = require('fs');
const { wrap } = require('module');
const { Script, createContext } = require('vm');
const { reporter } = require('./reporter');
const cluster = require('cluster');

if (cluster.isMaster) {
    cluster.fork(); // fork as many as you want

    cluster.on('setup', () => {
        reporter.emit('suite start');
    })
    cluster.on('exit', () => {
        reporter.emit('suite end');
    })
} else {
    async function run() {
        const file = fs.readFileSync('./index.js', { encoding: 'utf-8' });
        const executable = wrap(file);
        const runner = new Script(executable);

        const context = createContext({
            it: async function (name, fn) {
                reporter.emit('test start', name);
                try {
                    (async function () {
                        await fn.call({ a: 1 });
                    })();
                } catch (e) {
                    reporter.emit('test fail');
                    console.error(e);
                }
                reporter.emit('test end')
            }
        })
        const result = runner.runInContext(context);
        try {
            await result(exports, require, module, __filename, __dirname);
        } catch {
            reporter.emit('suite fail');
        }
    }
    run().finally(() => {
        process.kill(process.pid);
    })
}
