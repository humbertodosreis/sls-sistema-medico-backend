/**
 * Route: DELETE /pacientes/{paciente_id}
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PACIENTES_TABLE;

exports.handler = async (event) => {
    try {
        const pacienteId = parseInt(event.pathParameters.paciente_id);
        let params = {
            TableName: tableName,
            Key: {
                paciente_id: pacienteId
            }
        };

        await dynamodb.delete(params).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders()
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