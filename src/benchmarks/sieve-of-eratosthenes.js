export default class SieveOfEratosthenes {
    async doSieveOfEratosthenes(n) {
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
}
