import http from 'http';
import Routes from './routes.js';
import cluster from 'cluster';

const cpus = !process.argv[2] ? require('os').cpus().length : process.argv[2];
const routes = new Routes();
if (cluster.isPrimary) {
    for (let i = 0; i < cpus; i++) {
        console.log(`Worker ${i} is on`);
        cluster.fork();
    }
}
else {    
    const server = http.createServer(routes.handler.bind(routes));
    server.listen(8080);
}
