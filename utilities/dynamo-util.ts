import { DynamoDB } from 'aws-sdk';

class DynamoDBUtil {
    dynamoDB = new DynamoDB();
    dynamoDBClient = new DynamoDB.DocumentClient();

    insertRow = async (
        params: DynamoDB.DocumentClient.PutItemInput,
    ): Promise<DynamoDB.DocumentClient.PutItemOutput> => {
        console.log('here');
        try {
            const result = await this.dynamoDBClient.put(params).promise();
            console.log('result: ', result);
            return result;
        } catch (err) {
            console.log('err: ', err);
        }
    };

    getRecord = async (
        params: DynamoDB.DocumentClient.GetItemInput,
    ): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
        const result = await this.dynamoDBClient.get(params).promise();
        return result;
    };

    query = async (params: DynamoDB.DocumentClient.QueryInput): Promise<DynamoDB.DocumentClient.QueryOutput> => {
        const result = await this.dynamoDBClient.query(params).promise();
        return result;
    };

    getAllRecords = async (
        params: DynamoDB.DocumentClient.QueryInput,
    ): Promise<DynamoDB.DocumentClient.QueryOutput> => {
        const result = await this.dynamoDBClient.query(params).promise();
        return result;
    };

    updateRecord = async (
        params: DynamoDB.DocumentClient.UpdateItemInput,
    ): Promise<DynamoDB.DocumentClient.UpdateItemOutput> => {
        const result = await this.dynamoDBClient.update(params).promise();
        return result;
    };
}

export default DynamoDBUtil;
