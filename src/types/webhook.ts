export type IWebhookItem = {
  _id: string;
  webhookName: string;
  webhookDescription?: string;
  webhookMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  webhookTimeout?: number;
  webhookURI: string;
  headers?: {
    key: string;
    value: string;
  }[];
  webhookRequestsPerMinute?: number;
};

export type IWebhookFilters = {
  id: string;
  webhookName: string;
};
