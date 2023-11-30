import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IParkingRequestFormProps {
  context: WebPartContext;
  siteUrl: string;
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  self:any;
}
