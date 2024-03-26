import * as React from "react";
import type { IDataCenterProps } from "./IDataCenterProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Select, Modal } from "antd";
import "./index.css";
import InputFeild from "./InputFeild";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { postData } from "../../../Services/Services";

interface IDataCenterState {
  inputFeild: any;
  language: any;
  conditionCheckBox: boolean;
}
interface IDataCenterState {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  redirection: any;
  isModalOpen: any;
  PendingWith: any;
}

export default class DataCenter extends React.Component<
  IDataCenterProps,
  IDataCenterState
> {
  public constructor(props: IDataCenterProps, state: IDataCenterState) {
    super(props);
    this.state = {
      inputFeild: {
        requestType:"",  
        organizationType:"",
        Name:"",
        company:"",
        ID:"",
        mobile:"",
        visitDate:"",
        escortID:"",
      },
      language: "En",
      conditionCheckBox: false,
      description: "",
      isDarkTheme: false,
      environmentMessage: "",
      hasTeamsContext: false,
      userDisplayName: "",
      redirection: false,
      isModalOpen: false,
      PendingWith: "Data Center Owner",
    };
  }
  public componentDidMount() {
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    if (window.location.href.indexOf("#view") != -1) {
      let itemIdn = itemId.split("#");
      itemId = itemIdn[0];
      this.setState({
        redirection: true,
      });
    }
    if (window.location.href.indexOf("?#viewitemID") != -1) {
      this.getData(itemId);
    }
  }

  public getData(itemId: any) {
    const { context } = this.props;
    const { inputFeild } = this.state;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('DataCenterAccess')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((listItems: any) => {
        console.log("listItems", listItems);
        this.setState({
          inputFeild: {
            ...inputFeild,
            requestType: listItems?.RequestType,
            Name: listItems?.Title,
            Id:listItems?.EmployeeID,
            company: listItems.Company,
            mobile: listItems.Mobile,
            escortID: listItems.EscortID,
            visitDate: listItems?.VisitDate
          },
        });
        console.log("Res listItems", listItems);
      });
  }

  public onSubmit = async () => {
    const { context } = this.props;
    const { inputFeild, conditionCheckBox,PendingWith } = this.state;
    if (conditionCheckBox == false) {
      alert("Please Agree the Terms and Conditions!");
    } else {
      console.log("Input Feild", inputFeild);
      const headers: any = {
        "X-HTTP-Method": "POST",
        "If-Match": "*",
      };
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify({
          Title:
            inputFeild.requestType == "DC visit Request"
              ? inputFeild.Name
              : context.pageContext.user.displayName,
          Email:
            inputFeild.requestType == "DC visit Request"
              ? inputFeild.Email
              : context.pageContext.user.email,
          EmployeeID: inputFeild.ID,
          RequestType: inputFeild.requestType,
          Company: inputFeild.company,
          Mobile: inputFeild.mobile,
          EscortID: inputFeild.escortID,
          VisitDate: new Date(inputFeild.visitDate),
          pendingWith:PendingWith
        }),
      };
      console.log(inputFeild.requestType, "requestType");
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('DataCenterAccess')/items`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log("Post Data", postData);
      } else {
        alert("visitor form Failed.");
        console.log("Post Failed", postResponse);
      }
      this.setState({
        inputFeild: {},
      });
    }
  };
  public onApproveReject: (Type: string, PendingWith: string) => void = async (
    Type: string,
    PendingWith: string
  ) => {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    const postUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('DataCenterAccess')/items('${itemId}')`;
    const headers = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };

    let body: string = JSON.stringify({
      status: Type,
      pendingWith: PendingWith,
    });

    const updateInteraction = await postData(context, postUrl, headers, body);
    console.log(updateInteraction);
    // if (updateInteraction) this.getBasicBlogs();
  };
  public render(): React.ReactElement<IDataCenterProps> {
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
    const {
      inputFeild,
      language,
      conditionCheckBox,
      redirection,
      PendingWith,
    } = this.state;
    const { context } = this.props;
    console.log(inputFeild.doorCheckBox, "doorcheckbox value");
    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Data Center Access Request Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Data Center Access Request Form
          </div>
          <div
            className="d-flex justify-content-center text-danger py-2 mb-4 headerText"
            style={{ backgroundColor: "#C8CDDB" }}
          >
            Please fill out the fields in * to proceed
          </div>
          <div className="d-flex justify-content-end mb-2">
            <Select
              style={{ width: "200px" }}
              bordered={false}
              allowClear={false}
              options={[{ value: "English" }, { value: "Arabic" }]}
              className={`border border-2 `}
              placeholder="Select Language"
              onChange={(value) => {
                console.log("value", value);
                this.setState({
                  language: value === "English" ? "En" : "Ar",
                });
              }}
            ></Select>
          </div>
          <div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En"
                ? "Data Center Access Request Form"
                : "معلومات الطلب الرئيسية"}
            </div>
            <div className="container">
              <div className="row">
                <InputFeild
                  type="select"
                  disabled={redirection}
                  label={language === "En" ? "Request Type " : "نوع الطلب "}
                  name="requestType"
                  options={["DC visit Request", "DC card Request"]}
                  state={inputFeild}
                  inputFeild={inputFeild.requestType}
                  self={this}
                />
              </div>

              {inputFeild.requestType == "DC visit Request" ? (
                <>
                  <div className="row">
                    <InputFeild
                      type="select"
                      disabled={redirection}
                      label={
                        language === "En"
                          ? "Organization Type"
                          : "Organization Type"
                      }
                      name="organizationType"
                      options={["Internal", "External"]}
                      state={inputFeild}
                      inputFeild={inputFeild.organizationType}
                      self={this}
                    />
                  </div>
                  {inputFeild.requestType === "Internal" ? (
                    <div className="row">
                      <InputFeild
                        type="text"
                        disabled={redirection}
                        label={"Enter ID"}
                        name="ID"
                        options={[]}
                        state={inputFeild}
                        inputFeild={inputFeild.ID}
                        self={this}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="row mb-4">
                        <InputFeild
                          type="text"
                          disabled={redirection}
                          label={"Name"}
                          name="Name"
                          options={[]}
                          state={inputFeild}
                          inputFeild={inputFeild.Name}
                          self={this}
                        />
                        <InputFeild
                          type="text"
                          disabled={redirection}
                          label={"Company"}
                          name="company"
                          options={[]}
                          state={inputFeild}
                          inputFeild={inputFeild.company}
                          self={this}
                        />
                      </div>
                      <div className="row mb-4">
                        <InputFeild
                          type="text"
                          disabled={redirection}
                          label={"Enter ID"}
                          name="ID"
                          options={[]}
                          state={inputFeild}
                          inputFeild={inputFeild.ID}
                          self={this}
                        />
                        <InputFeild
                          type="text"
                          disabled={redirection}
                          label={"Mobile Number"}
                          name="mobile"
                          options={[]}
                          state={inputFeild}
                          inputFeild={inputFeild.mobile}
                          self={this}
                        />
                      </div>
                      <div className="row mb-4">
                        <InputFeild
                          type="date"
                          disabled={redirection}
                          label={"Visit Data"}
                          name="visitDate"
                          options={[]}
                          state={inputFeild}
                          inputFeild={inputFeild.visitDate}
                          self={this}
                        />
                        <InputFeild
                          type="text"
                          disabled={redirection}
                          label={"Escort ID"}
                          name="escortID"
                          options={[]}
                          state={inputFeild}
                          inputFeild={inputFeild.escortID}
                          self={this}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="row mb-4">
                  <InputFeild
                    type="text"
                    disabled={redirection}
                    label={"Name"}
                    name="Name"
                    options={[]}
                    state={inputFeild}
                    inputFeild={context.pageContext.user.displayName}
                    self={this}
                  />
                  <InputFeild
                    type="text"
                    disabled={redirection}
                    label={"Email"}
                    name="Email"
                    options={[]}
                    state={inputFeild}
                    inputFeild={context.pageContext.user.email}
                    self={this}
                  />
                </div>
              )}

              <div>
                <div className="d-flex justify-content-start ps-2 mb-2">
                  <input
                    className="form-check"
                    disabled={redirection}
                    type="checkbox"
                    checked={conditionCheckBox}
                    onChange={(event) => {
                      this.setState({
                        conditionCheckBox: event.target.checked,
                      });
                    }}
                  />
                  <label className={`ps-3`}>
                    <a
                      href="#"
                      onClick={() => this.setState({ isModalOpen: true })}
                    >
                      {language === "En"
                        ? "I agree to Terms & Conditions"
                        : "أوافق على الشروط والأحكام"}
                    </a>
                    <span className="text-danger">*</span>
                  </label>
                </div>
              </div>
              {redirection == false && (
                <div className="d-flex justify-content-end mb-2 gap-3">
                  <button
                    className="px-4 py-2"
                    style={{ backgroundColor: "#E5E5E5" }}
                    type="button"
                    onClick={() => {
                      window.history.go(-1);
                    }}
                  >
                    {language === "En" ? "Cancel" : "إلغاء الأمر"}
                  </button>
                  <button
                    className="px-4 py-2 text-white"
                    style={{ backgroundColor: "#223771" }}
                    type="button"
                    onClick={() => {
                      this.onSubmit();
                    }}
                  >
                    {language === "En" ? "Submit" : "إرسال"}
                  </button>
                </div>
              )}
            </div>
            {(PendingWith === "Data Center Owner" ||
              PendingWith === "SSIMS Manager") &&
              redirection == true && (
                <div className="d-flex justify-content-end mb-2 gap-3">
                  <button
                    className="px-4 py-2 text-white"
                    style={{ backgroundColor: "#223771" }}
                    type="button"
                    onClick={() => {
                      if (PendingWith === "Data Center Owner") {
                        this.onApproveReject("Approve", "SSIMS Manager");
                      } else {
                        this.onApproveReject("Approve", "Completed");
                      }
                    }}
                  >
                    {language === "En" ? "Approve" : "يعتمد"}
                  </button>
                  <button
                    className="px-4 py-2 text-white"
                    style={{ backgroundColor: "#223771" }}
                    type="button"
                    onClick={() => {
                      if (PendingWith === "Data Center Owner") {
                        this.onApproveReject(
                          "Reject",
                          "Rejected by Data Center Owner"
                        );
                      } else {
                        this.onApproveReject(
                          "Reject",
                          "Rejected by SSIMS Manager"
                        );
                      }
                    }}
                  >
                    {language === "En" ? "Reject" : "يرفض"}
                  </button>
                </div>
              )}
          </div>
          <Modal
            bodyStyle={{ padding: "25px 50px 25px 50px" }}
            width={750}
            footer={null}
            closable={false}
            visible={this.state.isModalOpen}
          >
            <h4 className="align-items-center">Terms And Conditions</h4>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <div className="campaign_model_footer d-flex justify-content-end align-items-center">
              <button
                className={`me-2 border-0 px-5 text-capitalize`}
                style={{ color: "#808080", height: "40px" }}
                onClick={() =>
                  this.setState({
                    isModalOpen: false,
                    conditionCheckBox: false,
                  })
                }
              >
                Don't agree
              </button>
              <button
                className={`border-0 px-5 text-white text-capitalize`}
                style={{ backgroundColor: "#223771", height: "40px" }}
                onClick={() => {
                  this.setState({
                    isModalOpen: false,
                    conditionCheckBox: true,
                  });
                }}
              >
                Agree
              </button>
            </div>
          </Modal>
        </div>
      </CommunityLayout>
    );
  }
}
