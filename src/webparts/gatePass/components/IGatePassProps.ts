import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IGatePassProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  self: any;
  siteUrl: string;
  context: WebPartContext;

}
