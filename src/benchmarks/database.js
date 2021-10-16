import mariadb from 'mariadb/promise.js';

export default class Database {
    async connect(){
        if(global.connection && global.connection.state !== 'disconnected')
            return global.connection;
    
        const connection = await mariadb.createPoolCluster();
        connection.add('master', 'mariadb://root:password@localhost:3306/nodejsdb');
        global.connection = connection;
        return connection;
    }
    
    async doDatabaseTest() {
        const clusterConnection = await this.connect();

        await clusterConnection.getConnection().then(conn => {
            let sql = `INSERT INTO pessoa (NOME, NASCIMENTO, SEXO, CIDADE,ENDERECO, NUMERO) 
                VALUES ('Bruno Caregnato', str_to_date('12-02-1996','%m-%d-%Y'), 'M' , 'Porto Alegre', 
                    'Avenida Protasio Alves', 255)`;
            conn.query(sql).then((row) => {
                const ordid = row.insertId;
                sql = 'SELECT * FROM pessoa';
                conn.query(sql).then(() => {
                    sql = `UPDATE pessoa SET CIDADE = 'Caxias do Sul' WHERE ORDID = ${ordid}`;
                    conn.query(sql).then(() => {
                        sql = `DELETE FROM pessoa WHERE ORDID = ${ordid}`;
                        conn.query(sql).then(() => {
                            conn.end();
                            return;                            
                        }).catch(error => { 
                            throw error;
                        });
                    }).catch(error => { 
                        throw error;
                    });
                }).catch(error => { 
                    throw error;
                });
            });
        });
    }

}
