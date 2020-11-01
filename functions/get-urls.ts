'use strict';

import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import DynamoDBUtil from '../utilities/dynamo-util';

const TABLE_NAME = process.env.URL_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {
    console.log('Received get-urls event', event);
    try {
        const dynamoUtil = new DynamoDBUtil();

        const params: DynamoDB.DocumentClient.ScanInput = {
            TableName: TABLE_NAME,
        };
        const data = await dynamoUtil.getAllRecords(params);
        console.log('Successfully fetched data', JSON.stringify(data.Items));
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                urls: data.Items,
                count: data.Count,
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'failure',
            }),
        };
    }
};
