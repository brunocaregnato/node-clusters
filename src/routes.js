export default class Routes {
    constructor() { }

    async defaultRoute(request, response) {
        response.writeHead(500);
        response.end('Nenhum benchmark selecionado!');
    }

    async get(request, response) {
        console.log(request.url);        

        response.writeHead(200);
        response.end();
    }

    handler(request, response) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        const chosen = this[request.method.toLowerCase()] || this.defaultRoute;
        console.log(`${request.method.toLowerCase()}${request.url}`)
        return chosen.apply(this, [request, response]);
    }

}