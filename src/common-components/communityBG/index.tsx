import * as React from "react";
import styles from "./communityBG.module.sass";

export interface ICommunityBGProps {
  children: any;
}

export default class CommunityBG extends React.Component<
  ICommunityBGProps,
  {}
> {
  public render(): React.ReactElement<ICommunityBGProps> {
    const { children } = this.props;
    return (
      <div className={`container-fluid p-0 ${styles.communityBGContainer}`}>
        {children}
      </div>
    );
  }
}
