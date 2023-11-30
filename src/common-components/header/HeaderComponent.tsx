import * as React from "react";
import { MSGraphClient } from "@microsoft/sp-http";

interface IHeaderComponentProps {
  currentPageTitle: string;
  // activeNav: string;
  context: any;
}

interface IHeaderComponentState {
  userPhoto: any;
  userDetails: any;
}

export default class HeaderComponent extends React.Component<
  IHeaderComponentProps,
  IHeaderComponentState
> {
  public constructor(
    props: IHeaderComponentProps,
    state: IHeaderComponentState
  ) {
    super(props),
      (this.state = {
        userPhoto: null,
        userDetails: null,
      });
  }
  public componentDidMount(): void {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient()
      .then((grahpClient: MSGraphClient): void => {
        grahpClient
          .api("/me/photo/$value")
          .version("v1.0")
          .responseType("blob")
          .get((error: any, photo: Blob, rawResponse?: any) => {
            if (error) {
              console.log("User Photo Error Msg:", error);
              return;
            }
            console.log("photo", photo);
            const url = URL.createObjectURL(photo);
            console.log("URL PHOTO", url);
            this.setState({ userPhoto: url });
            console.log("rawResponse==>>", rawResponse);
          });
      });

    context.msGraphClientFactory
      .getClient()
      .then((grahpClient: MSGraphClient): void => {
        grahpClient
          .api("/me")
          .version("v1.0")
          .get((error: any, rawResponse?: any) => {
            if (error) {
              console.log("User Details Error Msg:", error);
              return;
            }
            this.setState({ userDetails: rawResponse });
            console.log("rawResponse==>>", rawResponse);
          });
      });
  }

  public render(): React.ReactElement<IHeaderComponentProps> {
    const { currentPageTitle, context } = this.props;
    const { userPhoto, userDetails } = this.state;
    console.log("userDetails in Visitor", userDetails);
    return (
      <>
        {/* {activeNav === "Home" && ( */}
          <div
            className="text-white p-4 pt-5"
            style={{ backgroundColor: "#24396F" }}
          >
            <div className="pb-2 visitorHeading">
              <div>{currentPageTitle}</div>
            </div>
            <div className="d-flex gap-2">
              <div className="" style={{ cursor: "pointer" }}>
                <img
                  src={userPhoto ? userPhoto : require("../../common-assets/avatar.png")}
                  alt="AvatarLogo"
                  height={"50px"}
                  width={"50px"}
                  className=" rounded-circle"
                />
              </div>
              <div
                className="d-flex flex-column justify-content-center"
                style={{ cursor: "pointer" }}
              >
                <span style={{ fontSize: "1.25em", fontWeight: 600 }}>
                  {userDetails
                    ? userDetails.displayName
                    : context?.userDisplayName}
                </span>
                <span>{userDetails?.jobTitle}</span>
              </div>
            </div>
          </div>
        {/* )} */}
      </>
    );
  }
}
