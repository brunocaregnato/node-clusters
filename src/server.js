import http from 'http';
import Routes from './routes.js';
import cluster from 'cluster';

const cpus = process.argv[2];
if (cluster.isPrimary && cpus) {
    console.log('Com clusters!');
    for (let i = 0; i < cpus; i++) {
        console.log(`Worker ${i} is on`);
        cluster.fork();
    }
}
else {
    startServer(8080);
}

cluster.on('exit', (worker) => {
    console.log(`Worker with PID ${worker.process.pid} is dead! Resurrecting...`);
    cluster.fork();
});

function startServer(port) {
    const routes = new Routes();
    http.createServer(routes.handler.bind(routes)).listen(port);
}