export type IApiKeyItem = {
  _id?: string;
  comment: string;
  secret: string;
  createdAt: string;
  updatedAt?: string;
  expiresOn?: string;
  status: 'active' | 'expired';
};
