#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const controller_1 = require("./../controller");
const args = yargs
    .usage('Usage: $0 -h [host] -p [port] -s [shutdown] -wd [wdPath] -l [logpath] -start -stop')
    .option('start', {
    describe: 'starts appium',
    type: 'string'
})
    .option('stop', {
    describe: 'stops appium',
    type: 'string'
})
    .option('host', {
    alias: 'h',
    describe: 'host (defaults to 127.0.0.1)',
    type: 'string'
})
    .default('host', '127.0.0.1')
    .option('port', {
    alias: 'p',
    describe: 'port (defaults to 4723)',
    type: 'string'
})
    .default('port', '4723')
    .option('shutdown', {
    alias: 's',
    describe: 'whether to shutdown appium if running (defaults to true)',
    type: 'boolean'
})
    .default('shutdown', true)
    .help('help', 'displays help')
    .argv;
if (args.start !== undefined)
    controller_1.startWinAppDriver({ host: args.h, port: args.p, shutdown: args.s, logDir: args.l });
if (args.stop !== undefined)
    controller_1.stopWinAppDriver({ host: args.h, port: args.p });
//# sourceMappingURL=winappdriver-controller.js.map