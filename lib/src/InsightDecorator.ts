interface IInsightDecorator {
  send(event: string, message: string, data: any): void;
}

export { IInsightDecorator };
