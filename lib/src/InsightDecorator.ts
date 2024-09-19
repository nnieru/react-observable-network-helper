type InsightCredential = {
  apiKey: string;
  projectId: string;
  version: string;
  environment: string;
  user: string;
  host: string;
  port: number;
};

interface IInsightDecorator {
  send(event: string, message: string, data: any): void;
}

export { InsightCredential, IInsightDecorator };
