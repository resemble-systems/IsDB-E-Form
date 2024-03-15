import * as React from "react";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Select } from "antd";
import "./index.css";
import InputFeild from "./InputFeild";
import type { IWorkPermitProps } from "./IWorkPermitProps";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import RichTextEditor from "../../../common-components/richTextEditor/RichTextEditor";
import { postData } from "../../../Services/Services";

interface IWorkPermitState {
  inputFeild: any;
  language: any;
  others: any;
  grind: any;
  braze: any;
  weld: any;
  cut: any;
  description: any;
  redirection: boolean;
  approverComment: any;
}

export default class WorkPermit extends React.Component<
  IWorkPermitProps,
  IWorkPermitState
> {
  public constructor(props: IWorkPermitProps, state: IWorkPermitState) {
    super(props);
    this.state = {
      inputFeild: {
        name: "",
        date: "",
        number: "",
        commonDate: "",
        area: "",
      },
      language: "En",
      description: "",
      others: false,
      grind: false,
      braze: false,
      weld: false,
      cut: false,
      redirection: false,
      approverComment: "",
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
    if (window.location.href.indexOf("?itemID") != -1) {
      console.log("CDM Banner inside if");
      const { context } = this.props;
      const { inputFeild } = this.state;
      context.spHttpClient
        .get(
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Work-Permit')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
          SPHttpClient.configurations.v1
        )
        .then((res: SPHttpClientResponse) => {
          return res.json();
        })
        .then((listItems: any) => {
          this.setState({
            inputFeild: {
              ...inputFeild,
              name: listItems?.Title,
              date: listItems?.RequestDate,
              number: listItems?.ContactNumber,
              commonDate: listItems?.CommonDate,
              area: listItems?.Area,
            },
            description: listItems?.Description,
            others: listItems?.Others == "true" ? true : false,
            grind: listItems?.Grind == "true" ? true : false,
            braze: listItems?.Braze == "true" ? true : false,
            weld: listItems?.Weld == "true" ? true : false,
            cut: listItems?.Cut == "true" ? true : false,
          });
          console.log("Res listItems", listItems);
        });
    }
  }

  public onSubmit = async () => {
    const { context } = this.props;
    const { inputFeild, description, others, grind, braze, cut, weld } =
      this.state;
    const checkMobileNo = (Number: any) => {
      const mobileNumberRegex = /^(\+[\d]{1,5}|0)?[1-9]\d{9}$/;
      const isValidNumber = !mobileNumberRegex.test(Number);
      console.log(isValidNumber, mobileNumberRegex, "mobile numbers testing");
      return isValidNumber;
    };

    if (
      !inputFeild.name ||
      inputFeild.name?.length < 3 ||
      inputFeild.name?.length > 30
    ) {
      alert(
        "Contractor Name cannot be blank, should have more than 2 characters and less than 30 characters!"
      );
    } else if (!inputFeild.date) {
      alert("Please enter the Request Date!");
    } else if (checkMobileNo(inputFeild.number)) {
      alert("Invalid Mobile Number!");
    } else if (!inputFeild.area) {
      alert("Area cannot be blank!");
    } else {
      const headers: any = {
        "X-HTTP-Method": "POST",
        "If-Match": "*",
      };

      const spHttpClintOptions: ISPHttpClientOptions =
        window.location.href.indexOf("?itemID") != -1
          ? {
              headers,
              body: JSON.stringify({
                Title: inputFeild?.name,
                RequestDate: inputFeild?.date,
                ContactNumber: inputFeild?.number,
                CommonDate: inputFeild?.commonDate,
                Area: inputFeild?.area,
                Description: description,
                Others: others,
                Grind: grind,
                Braze: braze,
                Weld: weld,
                Cut: cut,
              }),
            }
          : {
              body: JSON.stringify({
                Title: inputFeild?.name,
                RequestDate: new Date(inputFeild?.date).toString(),
                ContactNumber: inputFeild?.number,
                CommonDate: new Date(inputFeild?.commonDate).toString(),
                Area: inputFeild?.area,
                Description: description,
                Others: others.toString(),
                Grind: grind.toString(),
                Braze: braze.toString(),
                Weld: weld.toString(),
                Cut: cut.toString(),
              }),
            };
      let data = window.location.href.split("=");
      let itemId = data[data.length - 1];
      let url =
        window.location.href.indexOf("?itemID") != -1
          ? `/_api/web/lists/GetByTitle('Work-Permit')/items('${itemId}')`
          : "/_api/web/lists/GetByTitle('Work-Permit')/items";

      context.spHttpClient
        .post(
          `${context.pageContext.web.absoluteUrl}${url}`,
          SPHttpClient.configurations.v1,
          spHttpClintOptions
        )
        .then((res) => {
          console.log("RES POST", res);
          alert(`You have successfully submitted`);
          window.history.go(-1);
        });
    }
  };
  public onApproveReject: (
    Type: string,
    pendingWith: string,
    comments: string
  ) => void = async (Type: string, pendingWith: string, comments?: string) => {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    const postUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Key-Request')/items('${itemId}')`;
    const headers = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };

    let body: string = JSON.stringify({
      status: Type,
      pendingWith: pendingWith,
      comments: comments || "",
    });

    const updateInteraction = await postData(context, postUrl, headers, body);
    console.log(updateInteraction);
    // if (updateInteraction) this.getBasicBlogs();
  };
  public render(): React.ReactElement<IWorkPermitProps> {
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
      grind,
      others,
      braze,
      cut,
      weld,
      description,
      redirection,
    } = this.state;
    const { context } = this.props;

    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Work Permit Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Work Permit Information
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
                ? "Work Permit Information"
                : "معلومات تصريح العمل"}
            </div>

            <div className="row">
              <InputFeild
                type="text"
                disabled={redirection}
                label={
                  <>
                    {language === "En" ? "Contractor Name" : "اسم المقاول"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="name"
                state={inputFeild}
                inputFeild={inputFeild.name}
                self={this}
              />

              <InputFeild
                type="datetime-local"
                label={
                  <>
                    {language === "En" ? "Request Date" : "تاريخ الطلب"}
                    <span className="text-danger">*</span>
                  </>
                }
                disabled={redirection}
                name="date"
                state={inputFeild}
                inputFeild={inputFeild.date}
                self={this}
              />
            </div>

            <div className="row">
              <InputFeild
                type="text"
                disabled={redirection}
                label={
                  <>
                    {language === "En" ? "Contact Number" : "رقم الاتصال"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="number"
                state={inputFeild}
                inputFeild={inputFeild.number}
                self={this}
              />

              <InputFeild
                type="datetime-local"
                disabled={redirection}
                label={
                  language === "En" ? "Commoncoment Date" : "تاريخ التوحيد"
                }
                name="commonDate"
                state={inputFeild}
                inputFeild={inputFeild.commonDate}
                self={this}
              />
            </div>

            <div className="row">
              <InputFeild
                type="text"
                disabled={redirection}
                label={
                  <>
                    {language === "En" ? "Area" : "منطقة"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="area"
                state={inputFeild}
                inputFeild={inputFeild.area}
                self={this}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "1em",
                  fontFamily: "Open Sans",
                  fontWeight: "600",
                  width: "24.5%",
                  backgroundColor: "#F0F0F0",
                  marginBottom: "8px",
                }}
              >
                <label className="ps-2 py-2" htmlFor="work description">
                  {
                    <>
                      {language === "En" ? "Work Description" : "وصف العمل"}
                      <span className="text-danger">*</span>
                    </>
                  }
                </label>
              </div>
              <RichTextEditor
                handleSubmit={""}
                // disabled={redirection}
                handleChange={(content: any) => {
                  this.setState({
                    description: content,
                  });
                }}
                uploadContent={description}
                placeholder={
                  language === "En" ? "Enter the data" : "أدخل البيانات"
                }
              />
            </div>

            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771", marginTop: "8px" }}
            >
              {language === "En" ? "Hot Work Required" : "العمل الساخن المطلوب"}
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                disabled={redirection}
                className="form-check"
                type="checkbox"
                checked={cut}
                onChange={(event) => {
                  this.setState({
                    cut: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En" ? "Cut" : "قص"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                disabled={redirection}
                className="form-check"
                type="checkbox"
                checked={weld}
                onChange={(event) => {
                  this.setState({
                    weld: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En" ? "Weld" : "لحم"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={braze}
                onChange={(event) => {
                  this.setState({
                    braze: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En" ? "Braze" : "بريز"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={grind}
                onChange={(event) => {
                  this.setState({
                    grind: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En" ? "Grind" : "طحن"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={others}
                onChange={(event) => {
                  this.setState({
                    others: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En" ? "Others" : "الاخرين"}
              </label>
            </div>
            {redirection == false && (
              <div className="d-flex justify-content-end mb-2 gap-3">
                <button
                  className="px-4 py-2"
                  disabled={redirection}
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
                  disabled={redirection}
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
            {(this.state.inputFeild.PendingWith === "FMSDC (Approver)" || this.state.inputFeild.PendingWith === "Head of Safety and Security" ) && (
              <div>
                <div
                  style={{
                    fontSize: "1em",
                    fontFamily: "Open Sans",
                    fontWeight: "600",
                    width: "24.5%",
                    backgroundColor: "#F0F0F0",
                  }}
                >
                  <label className="ps-2 py-2" htmlFor="approverComment">
                    {language === "En" ? "Approver Comment" : "تعليقات الموافق"}
                  </label>
                </div>
                <textarea
                  className="form-control mb-2 mt-2"
                  rows={3}
                  placeholder={
                    language === "En" ? "Add a comment..." : "أضف تعليقا..."
                  }
                  value={this.state.approverComment}
                  onChange={(e) =>
                    this.setState({ approverComment: e.target.value })
                  }
                />
                <div className="d-flex justify-content-end mb-2 gap-3">
                  <button
                    className="px-4 py-2"
                    style={{ backgroundColor: "#223771" }}
                    type="button"
                    onClick={() => {
                      const { inputFeild, approverComment } = this.state;

                      if (inputFeild.PendingWith === "FMSDC (Approver)") {
                        this.onApproveReject(
                          "Approve",
                          "Head of Safety and Security",
                          approverComment
                        );
                      } else {
                        this.onApproveReject(
                          "Approve",
                          "Completed",
                          approverComment
                        );
                      }
                    }}
                  >
                    {language === "En" ? "Approve" : "يعتمد"}
                  </button>
                  <button
                    className="px-4 py-2 text-white"
                    style={{ backgroundColor: "#E5E5E5" }}
                    type="button"
                    onClick={() => {
                      const { inputFeild, approverComment } = this.state;

                      if (inputFeild.PendingWith === "FMSDC (Approver)") {
                        this.onApproveReject(
                          "Reject",
                          "Rejected by FMSDC (Approver)",
                          approverComment
                        );
                      } else {
                        this.onApproveReject(
                          "Reject",
                          "Rejected by Head of Safety and Security (Approver)",
                          approverComment
                        );
                      }
                    }}
                  >
                    {language === "En" ? "Reject" : "يرفض"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CommunityLayout>
    );
  }
}
