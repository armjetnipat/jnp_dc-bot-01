const api = require('./api');
const { login, getToken } = require('./auth');
const { log } = require('../utils/logger');

async function getMyVps() {
    const token = await getToken();

    try {
        const { data } = await api.get('/api/my-vps', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return data;
    } catch (err) {
        if (err.response?.status === 401) {
            token = await login();

            const { data } = await api.get('/api/my-vps', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return data;
        }

        throw err;
    }
}

module.exports = { getMyVps };