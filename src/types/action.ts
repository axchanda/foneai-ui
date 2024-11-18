export type IActionItem = {
  _id: string;
  actionName: string;
  actionDescription?: string;
  actionOperation: IActionOperation;
  actionParameters?: IActionParameterItem[];
};

export type IActionListType = {
  _id: string;
  actionName: string;
}[];

export type IActionParameterItem = {
  parameterIsRequired: boolean;
  parameterName: string;
  parameterType?: number | string | boolean;
  parameterDescription: string;
};

export type IActionOperation =
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
