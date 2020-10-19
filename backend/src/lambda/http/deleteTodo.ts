import 'source-map-support/register'
import {deleteTodo} from '../../businessLogic/todos'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  console.log(`TODO Id: ${todoId}`);

  // TODO: Remove a TODO item by id
  var result = await deleteTodo(todoId, event.headers.Authorization.split(' ')[1]);
  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      result: result
    })
  }
}
