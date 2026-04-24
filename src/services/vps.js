const api = require('./api');
const { log } = require('../utils/logger');

async function getMyVps() {

    try {
        const { data } = await api.get('/api/v1/my-vps', {
            headers: {
                "x-api-key": `${process.env.API_TOKEN}`
            }
        });

        return data;
    } catch (err) {
        if (err.response?.status === 401) {

            const { data } = await api.get('/api/v1/my-vps', {
                headers: {
                    "x-api-key": `${process.env.API_TOKEN}`
                }
            });

            return data;
        }

        throw err;
    }
}

module.exports = { getMyVps };