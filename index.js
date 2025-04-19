require('dotenv').config()
var forever = require('forever-monitor');
var createPrompt = require('prompt-sync');
const prompt = createPrompt({ sigint: true });
const index = async () => {
    if (process.env.SERVER_LIST == "") {
        process.env.SERVER_NAME = "defaul"
        process.env.SERVER_PORT = process.env.PORT
    } else {
        let SERVER_LIST = {}
        process.env.SERVER_LIST.split(',').forEach((pair, index) => {
            const [name, port] = pair.split(':');
            SERVER_LIST[index + 1] = {
                name: name.trim(),
                port: parseInt(port.trim())
            };
        });
        let action, default_action = '1'
        Object.keys(SERVER_LIST).forEach((k) => {
            console.log(`${k}. ${SERVER_LIST[k]['name']} - port ${SERVER_LIST[k]['port']}`)
        })
        let choose = prompt(`choose(default ${default_action}): `)
        console.log()
        if (choose == "") choose = default_action
        action = SERVER_LIST[choose]
        if (!action) return

        process.env.SERVER_NAME = action.name
        process.env.SERVER_PORT = action.port
    }


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
}
index()
