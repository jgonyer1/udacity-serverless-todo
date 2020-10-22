import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger';
const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger("todoAccess");
export class TodoAccess{
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly imagesBucket = process.env.IMAGES_S3_BUCKET
    ){}

    async getTodosByUser(userId: string): Promise<TodoItem[]>{
      try{
        const result = await this.docClient.query({
          TableName: this.todosTable,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues:{
            ":userId": userId
          }
      }).promise();
        return result.Items as TodoItem[];
      }catch(e){
        logger.error(`Failed to get todos for userId: ${userId}`, {error: e.error.message});
      }
        
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem>{
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todoItem
      }).promise();
      return todoItem;
    }

    async updateTodoAttachmentUrl(todoId:string, userId: string){
      const updateExpression = "SET attachmentUrl = :url";
      const expressionAttributeValues = { ":url": `https://${this.imagesBucket}.s3.amazonaws.com/${userId}_${todoId}` };

      try{
        const result = await this.docClient.update({
          TableName: this.todosTable,
          Key: { userId, todoId },
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "UPDATED_NEW"
        }).promise();
        return result;
      }catch(e){
        logger.error(`Failed to udpate attachment url for todoId: ${todoId}`)
        return undefined;
      }      
    }

    async updateTodo(updateTodoItem: UpdateTodoRequest, todoId: string, userId: string): Promise<any>{
      await this.docClient.update({
        TableName: this.todosTable,
        Key:{ userId, todoId },
        UpdateExpression: buildUpdateStatement(updateTodoItem),
        ExpressionAttributeNames: getUpdateExpressionAttributeNames(updateTodoItem),
        ExpressionAttributeValues: getUpdateExpressionValues(updateTodoItem)
      }).promise();
      return {};
    }

    async deleteTodo(todoId: string, userId: string): Promise<any>{
      return await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      }).promise(); 
    }
}

function buildUpdateStatement(updateTodoItem: UpdateTodoRequest): string{
  return  `SET ${Object.keys(updateTodoItem).map(key => `#${key} = :${key}`).join(",")}`;
}
function getUpdateExpressionValues(updateTodoItem: UpdateTodoRequest): any{
  return Object.keys(updateTodoItem).reduce(function(accumulator, currentValue){
    accumulator[`:${currentValue}`] = updateTodoItem[currentValue];
    return accumulator;
  }, {});
}
function getUpdateExpressionAttributeNames(updateTodoItem: UpdateTodoRequest){
  return Object.keys(updateTodoItem).reduce(function(accumulator, currentValue){
    accumulator[`#${currentValue}`] = currentValue;
    return accumulator;
  }, {});
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
}