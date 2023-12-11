import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISafetyIncidentProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  siteUrl: string;
  self: any;
}
