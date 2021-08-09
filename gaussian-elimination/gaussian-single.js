init();

function init() {
   test();
}

/**
 * Sistema:
 * 2x + y - 3z = -1
 * -x + 3y + 2z = 12
 * 3x + y - 3z = 0
 */
function test() {
    let A = [[2, 1, -3], [-1, 3, 2], [3, 1, -3]];
    let x = [-1, 12, 0];
    console.log(doGaussianElimination(A, x));
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