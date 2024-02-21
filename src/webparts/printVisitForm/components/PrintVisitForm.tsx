import * as React from "react";
import type { IPrintVisitFormProps } from "./IPrintVisitFormProps";
import { Row, Col } from "antd";
import "./index.css";
// import  pattern  from "../assets/pattern.svg";
import CommunityLayout from "../../../common-components/communityLayout";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import moment from "moment";
import QRCode from "react-qr-code";

interface IPrintVisitFormState {
  VisitListItemsbyId: any;
}

export default class PrintVisitForm extends React.Component<
  IPrintVisitFormProps,
  IPrintVisitFormState
> {
  public constructor(props: IPrintVisitFormProps, state: IPrintVisitFormState) {
    super(props);
    this.state = { VisitListItemsbyId: null };
  }
  public componentDidMount() {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data?.length - 1];
    console.log(itemId, " itemId");
    context.spHttpClient
      .get(
        `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('VisitorRequestForm')/items('${itemId}')?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((listItems: any) => {
        console.log("listItems.value Edit News", listItems);

        console.log(listItems.value, "filteredData");
        // const filteredData = listItems.filter(
        //   (e: any) => e.Id == itemId
        // );

        // console.log(filteredData,"filteredData")
        this.setState({
          VisitListItemsbyId: listItems,
        });
      });
  }

  public render(): React.ReactElement<IPrintVisitFormProps> {
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    // let bootstarp5JS =
    //   "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
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
    const { context } = this.props;
    const { VisitListItemsbyId } = this.state;
    // Call and pass the UrL as Params whereever necessary to generate QR CODE.
    const qrCode = (qrData: string) => {
      return (
        <QRCode style={{ height: "50px", width: "50px" }} value={qrData} />
      );
    };

    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Visit Request Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          {this.state.VisitListItemsbyId && (
            <Row>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Row>
                  <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div></div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <div className="id-card-hook"></div>
                    <div id="pattern" className="bg-white shadow rounded-top">
                      <div className="d-flex flex-column align-items-center rounded">
                        <div
                          className="d-flex flex-column align-items-center mt-5"
                          style={{
                            fontFamily: "Open Sans",
                            fontWeight: 600,
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "Open Sans",
                              fontWeight: 600,
                            }}
                          >
                            If found, please return{" "}
                          </div>
                          <div
                            style={{
                              fontFamily: "Open Sans",
                              fontWeight: 600,
                            }}
                          >
                            to Islamic Development
                          </div>{" "}
                          <div
                            style={{
                              fontFamily: "Open Sans",
                              fontWeight: 600,
                            }}
                          >
                            Bank, JEDDAH 21432
                          </div>{" "}
                          <div
                            style={{
                              fontFamily: "Open Sans",
                              fontWeight: 600,
                            }}
                          >
                            Safety & Security
                          </div>{" "}
                          <div>Section</div>{" "}
                          <div
                            className="mb-4"
                            style={{
                              fontFamily: "Open Sans",
                              fontWeight: 600,
                            }}
                          >
                            Call 6466090
                          </div>
                          <div>{qrCode(VisitListItemsbyId.Visitormobileno)}</div>
                          <div
                            className="mt-4"
                            style={{
                              fontFamily: "Open Sans",
                              fontWeight: 600,
                            }}
                          >
                            {" "}
                            Exp: auto stamp 3 years
                          </div>
                          <div
                            style={{
                              fontFamily: "Open Sans",
                              fontWeight: 600,
                            }}
                          >
                            From initial date
                          </div>
                        </div>
                      </div>
                      <div
                        className=""
                        style={{
                          position: "absolute",
                          bottom: "20px",
                          marginLeft: "110px",
                        }}
                      >
                        <img
                          src={require("../assets/logo.png")}
                          alt="Logo"
                          // height={"50px"}
                          // width={"50px"}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div></div>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Row>
                  <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div></div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <div className="id-card-hook"></div>
                    <div id="pattern" className="bg-white shadow rounded-top">
                      <div className="d-flex flex-column justify-content-center align-items-center rounded">
                        <div className="mx-3 mt-5">
                          <img
                            src={require("../assets/logo.png")}
                            alt="Logo"
                            // height={"50px"}
                            // width={"50px"}
                          />
                        </div>
                        <img
                          style={{ borderRadius: "50%" }}
                          className="h-100 m-3"
                          src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${VisitListItemsbyId?.Visitoremailaddress}`}
                          alt="word"
                          width={"100px"}
                        />
                      </div>
                      <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ fontFamily: "Open Sans", fontWeight: 600 }}
                      >
                        <div
                          className=""
                          style={{
                            fontFamily: "Open Sans",
                            fontWeight: 600,
                          }}
                        >
                          ID: {VisitListItemsbyId.Id}
                        </div>
                        <div
                          className=""
                          style={{
                            fontFamily: "Open Sans",
                            fontWeight: 600,
                          }}
                        >
                          Visit Date:{" "}
                          {moment(VisitListItemsbyId.Visitorvisithour).format(
                            "DD/MM/YYYY"
                          )}{" "}
                        </div>
                        <div
                          className=""
                          style={{
                            fontFamily: "Open Sans",
                            fontWeight: 600,
                          }}
                        >
                          Visitor Name: {VisitListItemsbyId.Visitorname}
                        </div>
                        <div
                          className=""
                          style={{
                            fontFamily: "Open Sans",
                            fontWeight: 600,
                          }}
                        >
                          Employee Name: {VisitListItemsbyId.Visitedemployee}
                        </div>
                        <div
                          className=""
                          style={{
                            fontFamily: "Open Sans",
                            fontWeight: 600,
                          }}
                        >
                          Department: {VisitListItemsbyId.Department}
                        </div>
                     
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div></div>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
        </div>
      </CommunityLayout>
    );
  }
}
