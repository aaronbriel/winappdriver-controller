let childProcess = require('cross-spawn'),//require('child_process'),//
    fs = require('fs'),
    path = require('path'),
    //http = require('http'),
    shell = require('shelljs'),
    retries = 0;

export const startWinAppDriver = (options?: any) => {

    options = options || {};

    let wadPath = options.path !== undefined ? options.path : 'C:\\Program Files (x86)\\Windows Application Driver\\',
        host = options.host !== undefined ? options.host : '127.0.0.1',
        port = options.port !== undefined ? options.port : '4723',
        shutdown = options.shutdown !== undefined ? options.shutdown : true,
        logDir = options.logDir !== undefined ? options.logDir : 'logs',
        command = wadPath + 'WinAppDriver.exe';// + ' ' + host + ' ' + port;

    // port += '/wd/hub';

    if (shutdown)
        stopWinAppDriver({port:port});

    console.log('Starting WinAppDriver...');

    if (!fs.existsSync(logDir))
        fs.mkdirSync(logDir);

    let out = fs.openSync(path.join(logDir, 'winappdriver'), 'w');
    let er = fs.openSync(path.join(logDir, 'winappdriver-error'), 'w');

    let child = childProcess.spawn(
        command,
        [],
        {
            //detached: true,
            stdio: ['inherit', out, er]//stdio: ['ignore', out, er]//
        }
    ).on('error', (err:any) => {
        throw err
    });

    statusCheck(child, host, port);
    // setTimeout(function () {
    //     startWinAppDriver({
    //         path:options.path,
    //         host:options.host,
    //         port:options.port,
    //         logDir:options.logDir,
    //         shutdown:false});
    // }, 1000)
};

// export const statusCheck = (host: string, port: string, child: any, statusCode: number,
//     wdPath = '/wd/hub/status', m
//
// axRetries = 20) => {
//
//     retries += 1;
//
//     http.get({
//         host: host,
//         port: port,
//         path: wdPath
//     }, (res:any) => {
//         statusCode = res.statusCode;
//     }).on('error', (err:any) => {
//         if (retries === maxRetries) {
//             console.log('Connection was refused after ' + maxRetries + ' attempts.');
//             console.log(err);
//             throw err;
//         }
//         return err;
//     });
//
//     if (statusCode === 200) {
//         console.log('WinAppDriver is running on ' + host + ':' + port + '!');
//         child.unref();
//         retries = 0;
//         statusCode = 0;
//     } else {
//         setTimeout(function () {
//             statusCheck(host, port, child, statusCode);
//         }, 1000)
//     }
// };

export const statusCheck = (child: any, host: string, port: string, maxRetries=30) => {

    retries += 1;

    let command = 'netstat -a -o -n | ' +
        'findstr "LISTENING" | ' +
        'findstr "' + host + ":" + port + '"';

    shell.exec(command,
        function(error: any, stdout: any){
            if (stdout.length > 0) {
                console.log('WinAppDriver is running on ' + host + ':' + port + '!');
                child.unref();
                retries = 0;
            } else {
                setTimeout(function () {
                    statusCheck(host, port, child);
                }, 1000)
            }
        });

    if (retries === maxRetries) {
        console.log('WinAppDriver was not started after ' + maxRetries + ' attempts.');
    }
};

export const stopWinAppDriver = (options?:any) => {

    options = options || {};

    let msg = 'WinAppDriver is shutdown',
        port = options.port !== undefined ? options.port : '4723';

    shell.exec('for /f "tokens=5" %p in (\'netstat -a -o -n ^| ' +
        'findstr "LISTENING" ^| ' +
        'findstr ":' + port + '"\') do ( taskkill -F -PID %p )');
    console.log(msg)
};