export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const mapToTodoModel = (item: any): Todo[] =>
  item.map((item: any) => ({
    userId: item.userId,
    id: item.id,
    title: item.title,
    completed: item.completed,
  }));
