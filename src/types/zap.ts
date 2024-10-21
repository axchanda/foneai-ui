export type IZapItem = {
  _id: string;
  zapName: string;
  zapDescription?: string;
  zapAction: IZapAction;
  zapParameters?: IZapParameterItem[];
};

export type IZapListType = {
  _id: string;
  zapName: string;
}[];

export type IZapParameterItem = {
  parameterIsRequired: boolean;
  parameterName: string;
  parameterType?: number | string | boolean;
  parameterDescription: string;
};

export type IZapAction =
  | {
      type: 'apiEndpoint';
      data: {
        linkedApiEndpoint: string;
        path?: string;
        responseInstructions?: string;
        payloadData?: any;
      };
    }
  | {
     type: 'knowledgeBase';
      data: {
        linkedKnowledgeBase: string;
        responseInstructions?: string;
      };
  }
  | {
      type: 'transfer';
      data: null;
    }
  | {
      type: 'hangup';
      data: null;
    };
