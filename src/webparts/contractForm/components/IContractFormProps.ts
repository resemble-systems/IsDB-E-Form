import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IContractFormProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  siteUrl: string;
  self: any;
  
}