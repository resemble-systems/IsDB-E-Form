import * as React from "react";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Select } from "antd";
import "./index.css";
import InputFeild from "./InputFeild";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";

interface IDataCenterAccessRequestFormState {
  inputFeild: any;
  language: any;
  conditionCheckBox: boolean;
}
interface IDataCenterAccessRequestFormProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: any;
}

export default class DataCenterAccessRequestForm extends React.Component<
  IDataCenterAccessRequestFormProps,
  IDataCenterAccessRequestFormState
> {
  public constructor(
    props: IDataCenterAccessRequestFormProps,
    state: IDataCenterAccessRequestFormState
  ) {
    super(props);
    this.state = {
      inputFeild: {},
      language: "En",
      conditionCheckBox: false,
    };
  }
  public componentDidMount() {
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    if (window.location.href.indexOf("?itemID") != -1) {
      this.getData(itemId);
    }
  }

  public getData(itemId: any) {
    const { context } = this.props;
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
          inputFeild: {},
        });
        console.log("Res listItems", listItems);
      });
  }

  public onSubmit = async () => {
    const { context } = this.props;
    const { inputFeild, conditionCheckBox } = this.state;
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
          Company: inputFeild.company,
          Mobile: inputFeild.mobile,
          EscortID: inputFeild.escortID,
          VisitDate: new Date(inputFeild.visitDate),
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

  public render(): React.ReactElement<IDataCenterAccessRequestFormProps> {
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
    const { inputFeild, language, conditionCheckBox } = this.state;
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
            <div className="row">
              <InputFeild
                type="select"
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
                    label={
                      language === "En"
                        ? "Organization Type"
                        : "Organization Type"
                    }
                    name="organizationType"
                    options={["Internal", "External"]}
                    state={inputFeild}
                    inputFeild={inputFeild.requestType}
                    self={this}
                  />
                </div>
                {inputFeild.requestType === "Internal" ? (
                  <div className="row">
                    <InputFeild
                      type="text"
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
                        label={"Name"}
                        name="Name"
                        options={[]}
                        state={inputFeild}
                        inputFeild={inputFeild.Name}
                        self={this}
                      />
                      <InputFeild
                        type="text"
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
                        label={"Enter ID"}
                        name="ID"
                        options={[]}
                        state={inputFeild}
                        inputFeild={inputFeild.ID}
                        self={this}
                      />
                      <InputFeild
                        type="text"
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
                        label={"Visit Data"}
                        name="visitDate"
                        options={[]}
                        state={inputFeild}
                        inputFeild={inputFeild.visitDate}
                        self={this}
                      />
                      <InputFeild
                        type="text"
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
                  label={"Name"}
                  name="Name"
                  options={[]}
                  state={inputFeild}
                  inputFeild={context.pageContext.user.displayName}
                  self={this}
                  disabled
                />
                <InputFeild
                  type="text"
                  label={"Email"}
                  name="Email"
                  options={[]}
                  state={inputFeild}
                  inputFeild={context.pageContext.user.email}
                  self={this}
                  disabled
                />
              </div>
            )}

            <div>
              <div className="d-flex justify-content-start ps-2 mb-2">
                <input
                  className="form-check"
                  type="checkbox"
                  checked={conditionCheckBox}
                  onChange={(event) => {
                    this.setState({
                      conditionCheckBox: event.target.checked,
                    });
                  }}
                />
                <label className={`ps-3`}>
                  <a href="#">
                    {language === "En"
                      ? "I agree to Terms & Conditions"
                      : "أوافق على الشروط والأحكام"}
                  </a>
                  <span className="text-danger">*</span>
                </label>
              </div>
            </div>

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
          </div>
        </div>
      </CommunityLayout>
    );
  }
}
