import { Task } from "../generated/schema";

export async function tasks(
  _: unknown,
  input: unknown,
  { context, dataSources }: any
): Promise<Task[]> {
  console.log(`currentUser ::::  ${JSON.stringify(context.currentUser)}`);
  return dataSources.todoAPI.getTasks();
}
