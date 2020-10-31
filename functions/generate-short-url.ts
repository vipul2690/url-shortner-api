'use strict';

import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { IUrl } from '../models/URL';

import DynamoDBUtil from '../utilities/dynamo-util';
import { generateId } from '../utilities/short-id-generator';

const TABLE_NAME = process.env.URL_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {
    try {
        const body = JSON.parse(event.body);
        const dynamoUtil = new DynamoDBUtil();
        if (body === null) {
            throw new Error('Invalid request');
        } else {
            const urlObject: IUrl = {
                urlId: uuidv4(),
                fullUrl: body.url,
                shortUrl: `http://localhost:3000/${generateId()}`,
                analytics: {
                    totalClicks: 0,
                },
            };
            const params: DynamoDB.DocumentClient.PutItemInput = {
                TableName: TABLE_NAME,
                Item: urlObject,
            };
            await dynamoUtil.insertRow(params);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'success',
                }),
            };
        }
    } catch (err) {
        if (err.message === 'Invalid request') {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid Request',
                }),
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'failure',
                }),
            };
        }
    }
};
