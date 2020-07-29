/**
 * Route: POST /paciente
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const moment = require('moment');
const uuidv4 = require('uuid/v4');
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PACIENTES_TABLE;

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).Item;
        item.paciente_id = uuidv4()
        item.nome = item.nome;
        item.data_nascimento = item.dataNascimento
        item.criado_em = moment().unix();

        const data = await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
        };
    } catch (err) {
        console.log("Error", err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : "Exception",
                message: err.message ? err.message : "Unknown error"
            })
        };
    }
}