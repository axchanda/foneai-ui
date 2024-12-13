export type IApiEndpointItem = {
  _id: string;
  apiEndpointName: string;
  apiEndpointDescription?: string;
  apiEndpointMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  apiEndpointTimeout?: number;
  apiEndpointURI: string;
  apiEndpointHeaders: IApiEndpointHeaders[];
};

export type IApiEndpointFilters = {
  id: string;
  apiEndpointName: string;
};

export type IApiEndpointHeaders = {
  isEncrypted: boolean;
  key: string;
  value: string;
};
