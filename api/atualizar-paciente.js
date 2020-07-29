/**
 * Route: PATCH /paciente/{paciente_id}
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const moment = require('moment');
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PACIENTES_TABLE;

exports.handler = async (event) => {
    try {
        const item = JSON.parse(event.body).Item;
        const pacienteId = parseInt(event.pathParameters.paciente_id);

        let data = await dynamodb.put({
            TableName: tableName,
            Item: item,
            ConditionExpression: '#pId = :pId',
            ExpressionAttributeNames: {
                '#pId': 'paciente_id'
            },
            ExpressionAttributeValues: {
                ':pId': pacienteId
            }
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