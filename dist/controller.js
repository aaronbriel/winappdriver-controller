"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let childProcess = require('child_process'), fs = require('fs'), shell = require('shelljs'), retries = 0;
exports.startWinAppDriver = (options) => {
    options = options || {};
    let host = options.host !== undefined ? options.host : '127.0.0.1', port = options.port !== undefined ? options.port : '4723', shutdown = options.shutdown !== undefined ? options.shutdown : true, logDir = options.logDir !== undefined ? options.logDir : 'logs', command = 'start cmd.exe /K WinAppDriver.exe ' + host + ' ' + port;
    if (shutdown)
        exports.stopWinAppDriver({ host: host, port: port });
    console.log('Starting WinAppDriver...');
    if (!fs.existsSync(logDir))
        fs.mkdirSync(logDir);
    childProcess.exec(command);
    exports.statusCheck(host, port);
};
exports.statusCheck = (host, port, maxRetries = 30) => {
    retries += 1;
    let command = 'netstat -a -o -n | ' +
        'findstr "LISTENING" | ' +
        'findstr "' + host + ":" + port + '"';
    shell.exec(command, function (error, stdout) {
        if (stdout.length > 0) {
            console.log('WinAppDriver is running on ' + host + ':' + port + '!');
            process.exit();
            retries = 0;
        }
        else {
            setTimeout(function () {
                exports.statusCheck(host, port);
            }, 1000);
        }
    });
    if (retries === maxRetries) {
        console.log('WinAppDriver was not started after ' + maxRetries + ' attempts.');
        process.exit(1);
    }
};
exports.stopWinAppDriver = (options) => {
    let msg = 'WinAppDriver is shutdown', host = options.host !== undefined ? options.host : '127.0.0.1', port = options.port !== undefined ? options.port : '4723';
    shell.exec('taskkill /F /IM cmd.exe /FI ' +
        '"windowtitle eq C:\\WINDOWS\\system32\\cmd.exe - WinAppDriver.exe  ' +
        host + ' ' + port + '" /T');
    console.log(msg);
};
//# sourceMappingURL=controller.js.map