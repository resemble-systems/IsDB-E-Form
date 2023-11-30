import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IVisitRequestFormReceptionistProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  siteUrl: string;
  self: any;
  
}
