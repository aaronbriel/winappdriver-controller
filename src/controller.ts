let childProcess = require('child_process'),//require('cross-spawn'),//
    //cmd = require('node-cmd'),
    //promise = require('bluebird').Promise,
    fs = require('fs'),
    // path = require('path'),
    //http = require('http'),
    shell = require('shelljs'),
    retries = 0;//,
    //getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd });


export const startWinAppDriver = (options?: any) => {

    options = options || {};

    let //wadPath = options.path !== undefined ? options.path : 'C:\\Program Files (x86)\\Windows Application Driver\\',
        host = options.host !== undefined ? options.host : '127.0.0.1',
        port = options.port !== undefined ? options.port : '4723',
        shutdown = options.shutdown !== undefined ? options.shutdown : true,
        logDir = options.logDir !== undefined ? options.logDir : 'logs',
        command = 'start cmd.exe /K WinAppDriver.exe';// + ' ' + host + ' ' + port; //
        //command = 'WinAppDriver.exe';// + ' ' + host + ' ' + port; //wadPath +

    // port += '/wd/hub';

    if (shutdown)
        stopWinAppDriver(); //{port:port}

    console.log('Starting WinAppDriver...');

    if (!fs.existsSync(logDir))
        fs.mkdirSync(logDir);

    //shell.exec(command);

    // let out = fs.openSync(path.join(logDir, 'winappdriver'), 'w');
    // let er = fs.openSync(path.join(logDir, 'winappdriver-error'), 'w');

    //still doesn't spawn.. maybe try https://www.npmjs.com/package/node-cmd with promises
    //exec is CLOSEST SOLUTION HERE
    //let child =
    childProcess.exec(command);
    //let child = childProcess.spawn(//
    //     'start',//command,
    //     ['cmd.exe', '/K', 'WinAppDriver.exe'],
    //     {
    //         detached: true,
    //         stdio: ['inherit', out, er]//stdio: ['ignore', out, er]//
    //     }
    // ).on('error', (err:any) => {
    //     throw err
    // });

    statusCheck(host, port); //child,
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

export const statusCheck = (host: string, port: string, maxRetries=30) => { //child: any,

    retries += 1;

    let command = 'netstat -a -o -n | ' +
        'findstr "LISTENING" | ' +
        'findstr "' + host + ":" + port + '"';

    shell.exec(command,
        function(error: any, stdout: any){
            if (stdout.length > 0) {
                console.log('WinAppDriver is running on ' + host + ':' + port + '!');
                //child.unref();
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

export const stopWinAppDriver = () => { //options?:any

    //THIS WORKS BUT THROWS ERROR IN CONSOLE
    // try {
    //     shell.exec("taskkill /F /IM cmd.exe");
    // } catch (err) {
    //     console.log('WinAppDriver is shutdown, err caught.');
    // }
    // shell.exec("taskkill /F /IM WinAppDriver.exe"); //WORKS BUT LEAVES CMD WINDOW OPEN
    shell.exec("taskkill /F /IM cmd.exe /T");

    // options = options || {};
    //
    // let msg = 'WinAppDriver is shutdown',
    //     port = options.port !== undefined ? options.port : '4723';
    //
    // shell.exec('for /f "tokens=5" %p in (\'netstat -a -o -n ^| ' +
    //     'findstr "LISTENING" ^| ' +
    //     'findstr ":' + port + '"\') do ( taskkill -F -PID %p )');
    // //shell.exec('call nonsecureSendKeys.bat "WinAppDriver.exe" "{ENTER}"');
    // //https://stackoverflow.com/questions/30419836/how-do-i-paste-text-to-a-console-window-of-an-specific-process-id-via-command-li
    console.log('WinAppDriver is shutdown');
};
