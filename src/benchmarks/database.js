import mysql from 'mysql2/promise.js';

export default class Database {
    async connect(){
        if(global.connection && global.connection.state !== 'disconnected')
            return global.connection;
    
        const connect = await mysql.createConnection('mysql://root:Juventude99!@localhost:3306/bancomysql');
        global.connection = connect;
        return connect;
    }
    
    async doDatabaseTest() {
        const conn = await this.connect();
        let sql = `INSERT INTO pessoa (NOME, NASCIMENTO, SEXO, CIDADE,ENDERECO, NUMERO) 
            VALUES ('Bruno Caregnato', str_to_date('12-02-1996','%m-%d-%Y'), 'M' , 'Porto Alegre', 
                'Avenida Protasio Alves', 255)`;
        conn.query(sql).then((row) => {
            const ordid = row[0].insertId;
            sql = 'SELECT * FROM pessoa';
            conn.query(sql).then(() => {
                sql = `UPDATE pessoa SET CIDADE = 'Caxias do Sul' WHERE ORDID = ${ordid}`;
                conn.query(sql).then(() => {
                    sql = `DELETE FROM pessoa WHERE ORDID = ${ordid}`;
                    conn.query(sql).then(() => {
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
    }
}