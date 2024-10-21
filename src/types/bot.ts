export type IBotType = {
  _id: string;
  username: string;
  botName: string;
  botIntroduction: string;
  botLanguage: 'en' | 'es' | 'ru';
  botEndpointing: number;
  botDaylightSavings: boolean;
  botIsInterruptable: boolean;
  botInstructions: string;
  botTimezone: string;
  botKnowledgeBaseId: string;
  createdAt: string;
  updatedAt: string;
  botVoice: {
    ttsProvider: string;
    voiceId: string;
  };
  botZaps: {
    zapId: string;
    trigger: string;
  }[];
};

export type IBotListType = {
  _id: string;
  username: string;
  botName: string;
  updatedAt: string;
  botLanguage: 'en' | 'es' | 'ru';
  botTimezone: string;
  botIsInterruptable: boolean;
  botVoice: {
    ttsProvider: string;
    voiceId: string;
  };
};
