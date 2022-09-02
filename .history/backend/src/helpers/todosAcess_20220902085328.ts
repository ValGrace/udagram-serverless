import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    constructor (
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_CREATED_AT_INDEX,
              
    ) {}
    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info('Creating a todo')  
            await this.docClient.put({
                TableName: this.todosTable,
                Item: todo
            }).promise()
            return todo
        }
        
    async getTodo(userId: string): Promise<TodoItem[]> {
        logger.info('querying existing todos')
       const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
                 
            }
         
        }).promise()
        logger.info(result)
          const todoitems = result.Items
        return todoitems as TodoItem[]
    }   

    async updateTodo(todoUpdate: TodoUpdate, todoId: string,  userId: string): Promise<TodoUpdate> {
           logger.info('Updating a todo item')
           const updatedItems = await this.docClient.update({
                TableName: this.todosTable,
                Key: {
                    "userId": userId,
                    "todoId": todoId
                },
                UpdateExpression: "set #username = :username, #due = :due, #todoDone = :todoDone",
                ExpressionAttributeNames: {
                    "#username": "name",
                    "#due": "dueDate",
                    "#todoDone": "done"
                },
                ExpressionAttributeValues: {
                    ":username": todoUpdate['name'],
                    ":due": todoUpdate['dueDate'],
                    ":todoDone": todoUpdate['done'] 
                },
                ReturnValues: "ALL NEW" 
            }).promise()
            logger.info('Successfully updated todo item', updatedItems)
            return updatedItems.Attributes as TodoUpdate
        }
      
        
    async deleteTodo(todoId: string, userId: string): Promise<string>  {
        logger.info('Deleting a todo item')
      await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            }
        }).promise()
        
        return "" as string
    }    
    }
        
 
 
