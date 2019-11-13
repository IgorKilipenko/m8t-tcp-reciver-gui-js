import axios from 'axios';

export const options = {
    baseURL: DEVELOPMENT ? `http://${REMOTE_API_URL}` : API_URL,
    timeout: 12000,
    method: 'post'
    //maxContentLength: 40000
};

export const headers = {
    json: {
        'Content-Type': 'application/json'
    }
};

export const types = {
    query: 'query',
    mutation: 'mutation',
    action: 'action'
};

export const components = {
    receiver: 'receiver',
    wifi: 'wifi',
    server: 'server',
    ntrip: 'ntrip'
};

export default const apiInstance = axios.create(options);