const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(doDatabaseTest());
});

app.get('/create', (req, res) => {
    res.send(createTable());
});

app.get('/drop', (req, res) => {
    res.send(dropTable());
});

app.listen(8080);

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require('mysql2/promise');
    const connect = await mysql.createConnection('mysql://root:password@localhost:3306/bancomysql');
    global.connection = connect;
    return connect;
}

async function createTable() {
    const conn = await connect();
    let sql = `CREATE TABLE pessoa (ORDID INT NOT NULL AUTO_INCREMENT, NOME varchar(50), NASCIMENTO date,
        SEXO varchar(1), CIDADE varchar(50), ENDERECO varchar(50), NUMERO int, PRIMARY KEY (ORDID))`;
    conn.query(sql).then(() => {
        console.log("Criou tabela!");
    });
}

async function dropTable() {
    const conn = await connect();
    conn.query('DROP TABLE pessoa').then(() => {
        console.log("Dropou a tabela!");
    });
}

async function doDatabaseTest() {
    const conn = await connect();
    sql = `INSERT INTO pessoa (NOME, NASCIMENTO, SEXO, CIDADE,ENDERECO, NUMERO) 
        VALUES ('Bruno Caregnato', str_to_date('12-02-1996','%m-%d-%Y'), 'M' , 'Porto Alegre', 
            'Avenida Protasio Alves', 255)`;
    conn.query(sql).then(() => {
        sql = 'SELECT * FROM pessoa';
        conn.query(sql).then(() => {
            sql = `UPDATE pessoa SET CIDADE = 'Caxias do Sul' WHERE NOME = 'Bruno Caregnato'`;
            conn.query(sql).then(() => {
                sql = `DELETE FROM pessoa WHERE NOME = 'Bruno Caregnato'`;
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