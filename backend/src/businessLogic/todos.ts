import * as uuid from 'uuid';
import {TodoItem} from '../models/TodoItem';
import {TodoAccess} from '../dataLayer/TodoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import {parseUserId} from '../auth/utils';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todoAccess = new TodoAccess();
export async function getTodosByUser(jwtToken: string): Promise<TodoItem[]> {
    return todoAccess.getTodosByUser(parseUserId(jwtToken));
}
export async function createTodo(createTodoRequest: CreateTodoRequest,jwtToken: string): Promise<TodoItem>{
    const itemId = uuid.v4();
    const userId = parseUserId(jwtToken);
    return await todoAccess.createTodo({
        todoId: itemId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    });
}
export async function deleteTodo(todoId: string, jwtToken: string){
    return await todoAccess.deleteTodo(todoId, parseUserId(jwtToken));
}
export async function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string){
    return await todoAccess.updateTodo(updateTodoRequest, todoId, parseUserId(jwtToken));
}
