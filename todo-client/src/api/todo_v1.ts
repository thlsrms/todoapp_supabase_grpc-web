import { GrpcWebFetchTransport, GrpcWebOptions } from '@protobuf-ts/grpcweb-transport';
import { RpcError } from '@protobuf-ts/runtime-rpc';
import { UserToken } from './auth_v1';
import {
  CreateTaskRequest,
  DeleteTaskRequest, DeleteTaskResponse,
  FetchTaskRequest, FetchTaskResponse,
  TaskFilter, UpdateTaskRequest,
} from './generated/todo/v1/todo';
import { Task } from './generated/todo/v1/task';
import { TodoClient } from './generated/todo/v1/todo.client';
export { Task, RpcError, UserToken };

export class Todo_v1 {
  private client: TodoClient;
  private webOptions: GrpcWebOptions;

  constructor(accessToken: UserToken) {
    this.webOptions = {
      baseUrl: 'http://localhost:8080',
      format: 'binary',
      meta: { 'Authorization': `Bearer ${accessToken.value}` },
    };
    const transport = new GrpcWebFetchTransport(this.webOptions);
    this.client = new TodoClient(transport);
  }

  async createTask(title: string, description?: string): Promise<Task | RpcError> {
    try {
      const request = await this.client.createTask(
        CreateTaskRequest.create({ title, description })
      );
      return request.response.task;
    } catch (error) {
      return error as RpcError;
    }
  }

  async updateTask(
    { id, title, completed, description }: UpdateTaskRequest
  ): Promise<Task | RpcError> {
    try {
      const request = await this.client.updateTask(
        UpdateTaskRequest.create({ id, title, completed, description })
      );
      return request.response.task;
    } catch (error) {
      return error as RpcError;
    }
  }

  /**
   * If no Id or Filter is specified fetch all tasks
   *
   * FilterField ENUM:
   * FILTERFIELD_UNSPECIFIED = 0;
   * FILTERFIELD_TITLE = 1;
   * FILTERFIELD_DESCRIPTION = 2;
   */
  async fetchTask(id?: number, taskFilter?: TaskFilter): Promise<FetchTaskResponse | RpcError> {
    try {
      const request = await this.client.fetchTask(
        FetchTaskRequest.create({ id, filter: taskFilter })
      );
      return request.response;
    } catch (error) {
      return error as RpcError;
    }
  }

  async deleteTask(id: number): Promise<DeleteTaskResponse | RpcError> {
    try {
      const request = await this.client.deleteTask(DeleteTaskRequest.create({ id }));
      return request.response;
    } catch (error) {
      return error as RpcError;
    }
  }
}
