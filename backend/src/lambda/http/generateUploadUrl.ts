import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/images';
import { updateTodoAttachmentUrl } from '../../businessLogic/todos';
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const url = generateUploadUrl(todoId, event.headers.Authorization.split(' ')[1]);
  await updateTodoAttachmentUrl(todoId,event.headers.Authorization.split(' ')[1]);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}
