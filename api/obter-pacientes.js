/**
 * Route: GET /pacientes
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PACIENTES_TABLE;

exports.handler = async (event) => {
    try {
        let query = event.queryStringParameters;
        let limit = query && query.limit ? parseInt(query.limit) : 5;

        let params = {
            TableName: tableName,
            Limit: limit,
            ScanIndexForward: false
        };

        let startUuid = query && query.start ? parseInt(query.start) : 0;

        if(startUuid > 0) {
            params.ExclusiveStartKey = {
                paciente_id: startUuid
            }
        }

        let data = await dynamodb.query(params).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data)
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