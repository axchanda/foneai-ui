export type IAgentType = {
  _id: string;
  username: string;
  name: string;
  introduction: string;
  language: 'en' | 'es' | 'ru';
  endpointing: number;
  daylightSavings: boolean;
  isInterruptible: boolean;
  instructions: string;
  timezone: string;
  knowledgeBaseId: string;
  createdAt: string;
  updatedAt: string;
  voice: {
    ttsProvider: string;
    voiceId: string;
  };
  keywords?: string[];
  actions: {
    actionId: string;
    trigger: string;
  }[];
};

export type IAgentListType = {
  _id: string;
  username: string;
  name: string;
  updatedAt: string;
  language: 'en' | 'es' | 'ru';
  isInterruptible: boolean;
  voice: {
    ttsProvider: string;
    voiceId: string;
  };
};