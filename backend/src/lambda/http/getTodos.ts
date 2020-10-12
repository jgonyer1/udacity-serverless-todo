import 'source-map-support/register'
import {createDocClient} from "../http/utils";

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const docClient = createDocClient();
const todosTable = process.env.TODOS_TABLE;
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);
  const items = await docClient.scan({
    TableName: todosTable
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
