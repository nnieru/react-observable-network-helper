export type PostModel = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const mapToPostModel = (item: any): PostModel[] =>
  item.map((item: any) => ({
    userId: item.userId,
    id: item.id,
    title: item.title,
    body: item.body,
  }));
