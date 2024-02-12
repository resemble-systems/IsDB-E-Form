import * as React from "react";
import type { IPrintVisitFormProps } from "./IPrintVisitFormProps";
import { Row, Col } from "antd";
import "./index.css";
// import  pattern  from "../assets/pattern.svg";
import CommunityLayout from "../../../common-components/communityLayout";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import moment from "moment";

interface IPrintVisitFormState {
  VisitListItemsbyId: any;
}

export default class PrintVisitForm extends React.Component<
  IPrintVisitFormProps,
  IPrintVisitFormState
> {
  public constructor(props: IPrintVisitFormProps, state: IPrintVisitFormState) {
    super(props);
    this.state = { VisitListItemsbyId: [] };
  }
  public componentDidMount() {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
console.log(itemId," itemId")
    context.spHttpClient
      .get(
        `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('VisitorRequestForm')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((listItems: any) => {
        console.log("listItems.value Edit News", listItems);

console.log(listItems.value,"filteredData")
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
    // SPComponentLoader.loadCss(bootstarp5JS);
    SPComponentLoader.loadCss(sansFont);
    SPComponentLoader.loadCss(font);
    SPComponentLoader.loadCss(fa);
    const { context } = this.props;

    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Parking Request Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          {this.state.VisitListItemsbyId?.length > 0 &&
            this.state.VisitListItemsbyId?.map((data: any) => (
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
                            style={{ fontWeight: "400px" }}
                          >
                            <div>If found, please return </div>
                            <div>to Islamic Development</div>{" "}
                            <div>Bank, JEDDAH 21432</div>{" "}
                            <div>Safety & Security</div> <div>Section</div>{" "}
                            <div className="mb-4">Call 6466090</div>
                            <div className="mt-4"> Exp: auto stamp 3 years</div>
                            <div>From initial date</div>
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
                            src={require("../assets/avatar.png")}
                            alt="word"
                            width={"100px"}
                          />
                        </div>
                        <div className="">ID: {data.Id}</div>
                        <div className="">
                          Visit Date:{" "}
                          {moment(data.Visitorvisithour).format("DD/MM/YYYY")}{" "}
                        </div>
                        <div className="">Visitor Name: {data.Visitorname}</div>
                        <div className="">
                          Employee Name: {data.Visitedemployee}
                        </div>
                        <div className="">Department: {data.Department}</div>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                      <div></div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
        </div>
      </CommunityLayout>
    );
  }
}
