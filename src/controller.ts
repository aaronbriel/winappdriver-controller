let childProcess = require('child_process'),
    fs = require('fs'),
    shell = require('shelljs'),
    retries = 0;

export const startWinAppDriver = (options?: any) => {

    options = options || {};

    let host = options.host !== undefined ? options.host : '127.0.0.1',
        port = options.port !== undefined ? options.port : '4723',
        shutdown = options.shutdown !== undefined ? options.shutdown : true,
        logDir = options.logDir !== undefined ? options.logDir : 'logs',
        command = 'start cmd.exe /K WinAppDriver.exe ' + host + ' ' + port;

    if (shutdown)
        stopWinAppDriver();

    console.log('Starting WinAppDriver...');

    if (!fs.existsSync(logDir))
        fs.mkdirSync(logDir);

    childProcess.exec(command);

    statusCheck(host, port);
};

export const statusCheck = (host: string, port: string, maxRetries=30) => { //child: any,

    retries += 1;

    let command = 'netstat -a -o -n | ' +
        'findstr "LISTENING" | ' +
        'findstr "' + host + ":" + port + '"';

    shell.exec(command,
        function(error: any, stdout: any){
            if (stdout.length > 0) {
                console.log('WinAppDriver is running on ' + host + ':' + port + '!');
                process.exit();
                retries = 0;
            } else {
                setTimeout(function () {
                    statusCheck(host, port); //child,
                }, 1000)
            }
        });

    if (retries === maxRetries) {
        console.log('WinAppDriver was not started after ' + maxRetries + ' attempts.');
        process.exit(1);
    }
};

export const stopWinAppDriver = (options: any) => {

    let msg = 'WinAppDriver is shutdown',
        port = options.port !== undefined ? options.port : '4723';

    shell.exec('taskkill /F /IM cmd.exe /FI "windowtitle eq C:\\WINDOWS\\system32\\cmd.exe - WinAppDriver.exe" /T');
    console.log('WinAppDriver is shutdown');
};
