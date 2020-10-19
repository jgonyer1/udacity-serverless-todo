import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from "../models/TodoItem";
const XAWS = AWSXRay.captureAWS(AWS)
export class TodoAccess{
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ){}

    async getTodosByUser(userId: string): Promise<TodoItem[]>{
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues:{
              ":userId": userId
            }
        }).promise();
        return result.Items as TodoItem[];
    }



    async createTodo(todoItem: TodoItem): Promise<TodoItem>{
      console.log("TODO ITEM TO CREATE: ", todoItem);
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todoItem
      }).promise();
      return todoItem;
    }

    async deleteTodo(todoId: string, userId: string): Promise<any>{
      console.log("DELETING TODO ID: ", todoId);
      return await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      }).promise();
      
    }
}
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }