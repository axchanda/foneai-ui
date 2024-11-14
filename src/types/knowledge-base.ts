export type IKnowledgeBaseItem = {
  _id: string;
  knowledgeBaseName: string;
  knowledgeBaseDescription?: string;
  status?: string;
};

export type IKnowledgeBaseQaPairType = {
  _id?: string;
  question: string;
  answer: string;
};

export type IKnowledgeBaseFilters = {
  id: string;
  knowledgeBaseName: string;
};
