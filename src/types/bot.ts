export type IBotType = {
  _id: string;
  username: string;
  botName: string;
  botIntroduction: string;
  botLanguage: 'en' | 'es';
  botEndpointing: number;
  botDaylightSavings: boolean;
  botIsInterruptable: boolean;
  botInstructions: string;
  botTimezone: string;
  botKnowledgeBaseId: string;
  createdAt: string;
  updatedAt: string;
  // botVoiceId: string;
  botVoice: {
    voiceProvider: string;
    voiceId: string;
  };
  botFunctions: {
    functionId: string;
    triggerLine: string;
  }[];
};
