const mysql = require('mysql2/promise');
const connection = connect();

if (connection) {
    console.log('Connected!');
    doDatabaseTest().then(result => {
        if (result)
            console.log('Finished!');
        else console.log('Errors!');
    })
    .catch(error => {
        throw error;
    })
}

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
    
    global.connection = await mysql.createConnection('mysql://root:password@localhost:3306/mysql');
    console.log('Conectou no MySQL!');
    return global.connection;
}

function doDatabaseTest() {
    const conn = connect();
    let sql = 'CREATE DATABASE mydb'
    conn.query(sql).then(() => {
        sql = `CREATE TABLE pessoa (NOME varchar(50), NASCIMENTO date,
            SEXO varchar(1), CIDADE varchar(50), ENDERECO varchar(50), NUMERO int`
        conn.query(sql).then(() => {
            sql = `INSERT INTO pessoa (NOME, NASCIMENTO, SEXO, CIDADE,ENDERECO, NUMERO) 
                VALUES ('Bruno Caregnato', '02/12/1996', 'M' , 'Porto Alegre', 
                    'Avenida Protasio Alves', 255`;
            conn.query(sql).then(() => {
                sql = 'SELECT * FROM pessoa';
                conn.query(sql).then(() => {
                    sql = `UPDATE pessoa SET CIDADE = 'Caxias do Sul' WHERE NOME = 'Bruno Caregnato'`;
                    conn.query(sql).then(() => {
                        sql = `DELETE FROM pessoa WHERE NOME = 'Bruno Caregnato'`;
                        conn.query(sql).then(() => {
                            sql = 'DROP TABLE pessoa';
                            conn.query(sql).then(() => {
                                sql = 'DROP DATABASE mydb';
                                conn.query(sql).then(() => {
                                    return true;
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    return false;
}