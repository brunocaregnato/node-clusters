const cluster = require('cluster');
const express = require('express');
const app = express();

const cpus = !process.argv[2] ? require('os').cpus().length : process.argv[2];
if (cluster.isMaster) {
    for (let i = 0; i < cpus; i++) {
        console.log(`Worker ${i} is on`);
        cluster.fork();
    }
}
else {
    app.get('/', (req, res) => {
        res.send(doSieveOfEratosthenes(req.query.n));
    });
    
    app.listen(8080);
}

function doSieveOfEratosthenes(n) {
    let values = [], primes = [];
    const limit = Math.sqrt(n);

    for (let i = 0; i < n; i++) values.push(true);

    for (let i = 2; i <= limit; i++) {
        if (values[i]) {
            for (let j = i * i; j < n; j += i) values[j] = false;            
        }
    }

    for (let i = 2; i < n; i++) {
        if (values[i]) primes.push(i);
    }

    return primes;
}

cluster.on('exit', (worker) => {
    console.log(`Worker with PID ${worker.process.pid} is dead! Resurrecting...`);
    cluster.fork();
});