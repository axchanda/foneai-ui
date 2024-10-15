export type IKnowledgeBaseItem = {
  _id: string;
  knowledgeBaseName: string;
  knowledgeBaseDescription: string;
  knowledgeBaseQaPairs?: {
    question: string;
    answer: string;
  }[];
  knowledgeBaseFiles: {
    fileName: string;
    fileURL: string;
  }[];
};

export type IKnowledgeBaseQaPairType = {
  question: string;
  answer: string;
};

export type IKnowledgeBaseFilters = {
  id: string;
  knowledgeBaseName: string;
};
