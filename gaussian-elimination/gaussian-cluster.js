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
    /** 
    * Sistema:
    * 0x + 1/3y - 1/3z = -1/3
    * 0x + 14/3y + 7/3z = 49/3
    * 3x + 2y + 4z = 19
    */
    app.get('/', (req, res) => {
        const A = [[0, (1/3), (-1/3)], [0, (14/3), (7/3)], [3, 2, 4]];
        const x = [(-1/3), (49/3), 19];
        
        res.send(doGaussianElimination(A, x));
    });
    
    app.listen(8080);
}

/**
 * Eliminacao de Gauss
 * @param array A matriz
 * @param array x vetor
 * @return x como solucao do vetor
 */
function doGaussianElimination(A, x) {

    let i, k, j;
    const n = A.length;

    // Gera matriz aumentada
    for (i = 0; i < n; i++) A[i].push(x[i]);    

    for (i = 0; i < n; i++) { 
        let maxElement = Math.abs(A[i][i]), maxRow = i;
        // Busca valor maximo da coluna
        for (k = i + 1; k < n; k++) { 
            if (Math.abs(A[k][i]) > maxElement) {
                maxElement = Math.abs(A[k][i]);
                maxRow = k;
            }
        }

        // Troca linha máxima com a linha atual (coluna por coluna)
        for (k = i; k < n + 1; k++) { 
            let aux = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = aux;
        }

        // Ajusta todas as linha abaixo da coluna atual para zero
        for (k = i + 1; k < n; k++) { 
            let c = -A[k][i]/A[i][i];
            for (j = i; j < n + 1; j++) {
                (i == j) ? A[k][j] = 0 : A[k][j] += c * A[i][j];
            }
        }
    }

    // Resolve a equação Ax = b para uma matriz triangular A
    x = new Array(n).fill(0);
    for (i = n - 1; i > -1; i--) {
        x[i] = A[i][n]/A[i][i];
        for (k=i-1; k > -1; k--) {
            A[k][n] -= A[k][i] * x[i];
        }
    }

    return x;
}

cluster.on('exit', (worker) => {
    console.log(`Worker with PID ${worker.process.pid} is dead! Resurrecting...`);
    cluster.fork();
});