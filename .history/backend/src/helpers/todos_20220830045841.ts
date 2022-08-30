import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils';

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function createTodo(CreateTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
  const todoId: string = uuid.v4()
  const bucket = process.env.ATTACHMENT_S3_BUCKET
  const userId = parseUserId(jwtToken) 
  return await todosAccess.createTodo({
    userId: userId,
    todoId: todoId,
    name: CreateTodoRequest.name,
    dueDate: CreateTodoRequest.dueDate,
    attachmentUrl: `https://${bucket}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().toISOString(),
    done: false
  })
}

export async function updateTodo(UpdateTodoRequest: UpdateTodoRequest, userId: string, todoId:string): Promise<TodoUpdate> {
   
    return await todosAccess.updateTodo({
        
        name: UpdateTodoRequest.name,
        dueDate: UpdateTodoRequest.dueDate,
        done: UpdateTodoRequest.done
    }, userId, todoId)
}

export async function createAttachmentPresignedUrl(url: string): Promise<string> {
  return await attachmentUtils.createAttachmentPresignedUrl(url)
}

export async function deleteTodo(todoId: string, userIdToken: string): Promise<string> {
   const userId = parseUserId(userIdToken)
   return await todosAccess.deleteTodo(todoId, userId)
}

export async function getTodosForUser(userToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(userToken)
   return await todosAccess.getTodo(userId)
}