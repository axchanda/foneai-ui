export type IWebhookItem = {
  _id: string;
  name: string;
  description: string;
  restMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  timeout: number;
  URL: string;
  headers: {
    key: string;
    value: string;
  }[];
  requestsPerMinute: number;
};
