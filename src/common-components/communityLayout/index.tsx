import * as React from "react";
import CommunityBg from "../communityBG";
import { Row, Col } from "antd";
import { SPComponentLoader } from "@microsoft/sp-loader";
import styles from "./communityLayout.module.sass";

export interface ICommunityLayoutProps {
  children: any;
  searchData?: any;
  self: any;
  context: any;
  selectedTitle: any;
  searchShow: boolean;
}

export default class CommunityLayout extends React.Component<
  ICommunityLayoutProps,
  {}
> {
  public render(): React.ReactElement<ICommunityLayoutProps> {
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    let sansFont =
      "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;600;700;900&display=swap";
    let font =
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&family=Oswald:wght@200;300;400;500;600;700&family=Roboto:wght@300;400;500;600;700;800&display=swap";
    let fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";

    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(sansFont);
    SPComponentLoader.loadCss(font);
    SPComponentLoader.loadCss(fa);

    const { children, self, context, selectedTitle, searchShow } = this.props;
    return (
      <CommunityBg>
        <Row className={`container h-100`}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div
              className={`d-flex flex-column justify-content-center ${styles.communityLayoutContainer}`}
            >
              {searchShow && (
                <div
                  className={`bg-light d-flex justify-content-between align-items-center ${styles.communityHeaderContainer}`}
                >
                  <div
                    className={`h-100 w-100 d-flex align-items-center ${styles.communitySearch}`}
                  >
                    <i className="fas fa-search ps-3 pe-2"></i>
                    <input
                      type="text"
                      placeholder="Search"
                      className={`fas fa-search h-100 w-100`}
                      onChange={(e) => {
                        self.setState({
                          searchData: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              )}
              <div
                className={`d-flex align-items-center py-3 text-capitalize ${styles.communityLocation}`}
              >
                <a
                  href={`${context.pageContext.web.absoluteUrl}/SitePages/Home.aspx`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className={`pe-3 text-white`}
                    style={{ cursor: "pointer" }}
                  >
                    Home
                  </div>
                </a>
                <i className={`fas fa-angle-right pe-3`}></i>
                <div className={`pe-3`}>{selectedTitle}</div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            {children}
          </Col>
        </Row>
      </CommunityBg>
    );
  }
}
