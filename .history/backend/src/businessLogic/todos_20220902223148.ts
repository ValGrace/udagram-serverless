import { TodosAccess } from '../dataAccessLogic/todosAcess'
import { AttachmentUtils } from '../filestorageAccess/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'


// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function createTodo(CreateTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
  const todoId: string = uuid.v4()
  const bucket = process.env.ATTACHMENT_S3_BUCKET
   
  return await todosAccess.createTodo({
    userId: jwtToken,
    todoId: todoId,
    name: CreateTodoRequest.name,
    dueDate: CreateTodoRequest.dueDate,
    attachmentUrl: `https://${bucket}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().toISOString(),
    done: false
  })
}

export async function updateTodo(UpdateTodoRequest: UpdateTodoRequest, todoId:string, jwtToken: string): Promise<TodoUpdate> {
   
    return await todosAccess.updateTodo({
        
        name: UpdateTodoRequest.name,
        dueDate: UpdateTodoRequest.dueDate,
        done: UpdateTodoRequest.done
    }, todoId, jwtToken)
}

export async function createAttachmentPresignedUrl(todoId: string): Promise<string> {
  return await attachmentUtils.createAttachmentPresignedUrl(todoId)
}

export async function deleteTodo(todoId: string, userIdToken: string): Promise<string> {
   
   return await todosAccess.deleteTodo(todoId, userIdToken)
}

export async function getTodosForUser(userToken: string): Promise<TodoItem[]> {
  
   return await todosAccess.getTodo(userToken)
}