import 'source-map-support/register'
import {createDocClient} from "../http/utils";

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const docClient = createDocClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, partitionKeyValue: any): Promise<APIGatewayProxyResult> => {
  const items = await docClient.query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  }).promise();
  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        items
    })
}
}
