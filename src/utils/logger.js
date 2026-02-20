const chalk = require('chalk');

module.exports = {
    log: (message, status) => {
        const timestamp = new Date().toLocaleString('th-TH', {timeZone: 'Asia/Bangkok'});
        switch (status) {
            case 'info':
                console.log(`[${timestamp}] ${chalk.blueBright(`[INFO]`)} ${message}`);
                return;
            case 'success':
                console.log(`[${timestamp}] ${chalk.greenBright(`[SUCCESS]`)} ${message}`);
                return;
            case 'error':
                console.error(`[${timestamp}] ${chalk.redBright(`[ERROR]`)} ${message}`);
                return;
            case 'warning':
                console.warn(`[${timestamp}] ${chalk.yellowBright(`[WARN]`)} ${message}`);
                return;
            default:
                console.log(`[${timestamp}] ${chalk.blueBright(`[INFO]`)} ${message}`);
                return;
        }
    }
}