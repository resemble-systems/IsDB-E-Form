import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IShiftReportProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  self: any;
  siteUrl: string;
  context: WebPartContext;
}
