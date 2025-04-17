var forever = require('forever-monitor');

var child = new (forever.Monitor)('src/index.js', {
    max: 100,
    'killTree': true,
    'uid': '260194',
});

child.on('exit', function () {
    console.log('src/index.js has exited after 100 restarts');
});

child.start();

process.on('SIGINT', () => {
    child.stop()

    process.exit(0);
});
