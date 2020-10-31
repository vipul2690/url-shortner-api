'use strict';

import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { IUrl } from '../models/URL';

import DynamoDBUtil from '../utilities/dynamo-util';

const TABLE_NAME = process.env.URL_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent): Promise<any> => {
    try {
        const body = JSON.parse(event.body);
        const dynamoUtil = new DynamoDBUtil();
        if (body === null) {
            throw new Error('Invalid request');
        } else {
            const url = body.fullUrl;
            const result = await dynamoUtil.query({
                TableName: TABLE_NAME,
                IndexName: 'UrlByFullUrl',
                KeyConditionExpression: 'fullUrl = :fullUrl',
                ExpressionAttributeValues: {
                    ':fullUrl': url,
                },
            });
            const urlObject: IUrl = result.Items[0] as IUrl;
            const params: DynamoDB.DocumentClient.PutItemInput = {
                TableName: TABLE_NAME,
                Item: {
                    ...urlObject,
                    ...body,
                },
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
