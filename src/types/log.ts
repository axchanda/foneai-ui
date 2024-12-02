import { da } from "@fullcalendar/core/internal-common";

export type ILogType = {
    _id: string;
    sessionParams?: {
      sessionStart: Date;
      sessionEnd: Date;
      connectionType: string;
      campaign: any;
      linkedAppType?: string;
      linkedApp: any;
      language: string;
      ttsProvider: string;
      voiceId: string;
    };
    sessionDuration: number;
    sessionDurationInMinutes: number;
    creditsPerMinute: number;
    sessionCreditsCharged: number;
    sessionRates: any;
  };
  
  export type ISessionLogType = {
    _id: string;
    sessionLog: Array<any>;
  };

  export type ISessionLogDetailType = {
    type: string;
    message: string;
    processCounter: number;
    error: string;
  };

  export type ILogFilters = {
    id: string;
    sessionStart?: any;
    sessionEnd?: any;
  };
  