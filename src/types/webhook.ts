export type IWebhookItem = {
  _id: string;
  webhookName: string;
  webhookDescription?: string;
  webhookMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  webhookTimeout?: number;
  webhookURI: string;
  headers: IWebhookHeaders[];
  webhookRequestsPerMinute?: number;
};

export type IWebhookFilters = {
  id: string;
  webhookName: string;
};

export type IWebhookHeaders = {
  key: string;
  value: string;
};
