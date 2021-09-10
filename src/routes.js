import SieveOfEratosthenes from './benchmarks/sieve-of-eratosthenes.js';
import GaussianElimination from './benchmarks/gaussian-elimination.js';
import Database from './benchmarks/database.js';

const BENCHMARK = {
    SIEVE_OF_ERATOSTHENES: 'sieve',
    GAUSSIAN_ELIMINATION: 'gaussian',
    DATABASE: 'db'
}

export default class Routes {
    constructor() { }

    async defaultRoute(request, response) {
        response.writeHead(501);
        response.end('Nenhum benchmark selecionado para o parâmetro passado!');
    }

    async get(request, response) {
        switch(request.url.replace('/', '')) {
            case BENCHMARK.SIEVE_OF_ERATOSTHENES:
                new SieveOfEratosthenes().doSieveOfEratosthenes(100000);
                break;
            case BENCHMARK.GAUSSIAN_ELIMINATION:
                /**
                * Sistema:
                * 0 + 1/3y - 1/3z = -1/3
                * 0 + 14/3y + 7/3z = 49/3
                * 3x + 2y + 4z = 19
                */
                const A = [[0, (1/3), (-1/3)], [0, (14/3), (7/3)], [3, 2, 4]];
                const x = [(-1/3), (49/3), 19];
                new GaussianElimination().doGaussianElimination(A, x);
                break;
            case BENCHMARK.DATABASE:
                new Database().doDatabaseTest();
                break;
            default: 
                this.defaultRoute(request, response);
                return;
        }

        response.end();
    }

    handler(request, response) {
        const chosen = this[request.method.toLowerCase()] || this.defaultRoute;
        return chosen.apply(this, [request, response]);
    }

}