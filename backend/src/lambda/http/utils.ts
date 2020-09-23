import * as AWS from 'aws-sdk';
export function createDocClient(){
    if(process.env.IS_OFFLINE){
      console.log("Creating a local DynamoDB instance");
      return new AWS.DynamoDB.DocumentClient({
          region: "localhost",
          endpoint: "http://localhost:8000"
      });
    }else{
        return new AWS.DynamoDB.DocumentClient();
    }
  }