import * as React from "react";
import { Select } from "antd";
import type { IVisitRequestCheckOutProps } from "./IVisitRequestCheckOutProps";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { SPComponentLoader } from "@microsoft/sp-loader";
import InputFeild from "./InputFeild";
import {
  SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
} from "@microsoft/sp-http";

interface IVisitRequestCheckOutState {
  inputFeild: any;
  visitorIdProof: any;
  visitorPhoto: any;
  consecutive: any;
  sheduledTime: any;
  language: any;
  Category: any;
  checkBox: any;
  nameSelected: any;
  nameOptions: any;
  autoComplete: any;
}

export default class VisitRequestBlockListView extends React.Component<
  IVisitRequestCheckOutProps,
  IVisitRequestCheckOutState
> {
  public constructor(
    props: IVisitRequestCheckOutProps,
    state: IVisitRequestCheckOutState
  ) {
    super(props);
    this.state = {
      inputFeild: {
        staffName: "",
        grade: "",
        staffId: "",
        Department: "",
        officeLocation: "",
        officeNumber: "",
        mobileNumber: "",
        immediateSupervisor: "",
        onBehalfOf: "",
        visitedEmployeeName: "",
        visitedEmployeeID: "",
        visitedEmployeeEntity: "",
        visitedEmployeePhone: "",
        visitedEmployeeGrade: "",
        visitorName: "",
        visitorMobileNumber: "",
        visitorEmailId: "",
        visitorNationality: "",
        visitorOrgType: "",
        visitorRelatedOrg: "",
        visitorPurposeOfVisit: "",
        visitorVisitTime: "",
        visitorNotify: "",
        visitorRemarks: "",
      },
      visitorIdProof: "",
      visitorPhoto: "",
      consecutive: false,
      sheduledTime: false,
      language: "En",
      Category: "English",
      checkBox: false,
      nameSelected: "",
      nameOptions: [],
      autoComplete: "off",
    };
  }
  public componentDidMount() {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];

    if (window.location.href.indexOf("?itemID") != -1) {
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
          this.setState({
            inputFeild: {
              staffName: listItems?.Title,
              grade: listItems?.Grade,
              staffId: listItems?.Staff_id,
              Department: listItems?.Department,
              officeLocation: listItems?.OfficeLocation,
              officeNumber: listItems?.Officephone,
              mobileNumber: listItems?.Mobilenumber,
              immediateSupervisor: listItems?.Immediatesupervisor,
              onBehalfOf: listItems?.Onbehalfof,
              visitedEmployeeName: listItems?.Visitedemployee,
              visitedEmployeeID: listItems?.Visitedemployeeid,
              visitedEmployeeEntity: listItems?.Visitedentity,
              visitedEmployeePhone: listItems?.Visitedemployeephone,
              visitedEmployeeGrade: listItems?.Visitedemployeestaffgrade,
              visitorName: listItems?.Visitorname,
              visitorMobileNumber: listItems?.Visitormobileno,
              visitorEmailId: listItems?.Visitoremailaddress,
              visitorNationality: listItems?.Visitornationality,
              visitorOrgType: listItems?.Visitororgtype,
              visitorRelatedOrg: listItems?.Visitorrelatedorganization,
              visitorPurposeOfVisit: listItems?.Visitorpurposeofvisit,
              visitorVisitTime: listItems?.Visitorvisithour,
              visitorNotify: listItems?.Visitornotify,
              visitorRemarks: listItems?.Visitorremarks,
            },
          });
        });
    }
  }
  public onSubmit = async () => {
    const { context } = this.props;

    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
      "Content-Type": "application/json;odata=nometadata",
    };

    const spHttpClintOptions: ISPHttpClientOptions =
      window.location.href.indexOf("?itemID") != -1
        ? {
            headers,
            body: JSON.stringify({
              Checkout: "true",
              CheckoutDate: new Date().toString(),
            }),
          }
        : {
            headers,
            body: JSON.stringify({
              Checkout: "true",
              CheckoutDate: new Date().toString(),
            }),
          };

    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];

    let url =
      window.location.href.indexOf("?itemID") != -1
        ? `/_api/web/lists/GetByTitle('VisitorRequestForm')/items('${itemId}')`
        : "/_api/web/lists/GetByTitle('VisitorRequestForm')/items";

    context.spHttpClient
      .post(
        `${context.pageContext.site.absoluteUrl}${url}`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((res) => {
        console.log("RES POST", res);

        this.setState({});
      });
  };
  public render(): React.ReactElement<IVisitRequestCheckOutProps> {
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
    const { inputFeild, visitorIdProof, visitorPhoto, language } = this.state;
    const { context, self } = this.props;
    const handleSubmit = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      console.log("Form Data", event);
      console.log("Form Submit", inputFeild, visitorIdProof, visitorPhoto);
    };
    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle=""
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Visitor Request Form (At Checkout)
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
          <form onSubmit={handleSubmit}>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              Requestor Information
            </div>
            <div className="row">
              <InputFeild
                self={this}
                disabled={true}
                type="text"
                label={language === "En" ? "Staff Name" : "اسم الموظفين"}
                name="staffName"
                state={inputFeild}
                inputFeild={inputFeild.staffName}
              />
              <InputFeild
                type="text"
                disabled={true}
                label={language === "En" ? "Grade" : "درجة"}
                name="grade"
                state={inputFeild}
                inputFeild={inputFeild.grade}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                disabled={true}
                label={language === "En" ? "ID Number" : "رقم الهوية"}
                name="staffId"
                state={inputFeild}
                inputFeild={inputFeild.staffId}
                self={this}
              />
              <InputFeild
                type="text"
                disabled={true}
                label={language === "En" ? "Department" : "قسم"}
                name="Department"
                state={inputFeild}
                inputFeild={inputFeild.Department}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                disabled={true}
                label={language === "En" ? "Office Location" : "موقع المكتب"}
                name="officeLocation"
                state={inputFeild}
                inputFeild={inputFeild.officeLocation}
                self={this}
              />
              <InputFeild
                type="text"
                disabled={true}
                label={language === "En" ? "Office Number" : "رقم المكتب"}
                name="officeNumber"
                state={inputFeild}
                inputFeild={inputFeild.officeNumber}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                disabled={true}
                label={
                  language === "En" ? "Mobile Number" : "رقم الهاتف المحمول"
                }
                name="mobileNumber"
                state={inputFeild}
                inputFeild={inputFeild.mobileNumber}
                self={this}
              />
              <InputFeild
                type="text"
                disabled={true}
                label={
                  language === "En" ? "Immediate Supervisor" : "المشرف المباشر"
                }
                name="immediateSupervisor"
                state={inputFeild}
                inputFeild={inputFeild.immediateSupervisor}
                self={this}
              />
            </div>
            <div className="row mb-4">
              <InputFeild
                type="text"
                disabled={true}
                label="On behalf of"
                name="onBehalfOf"
                state={inputFeild}
                inputFeild={inputFeild.onBehalfOf}
                self={this}
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              Visited Employee Information
            </div>
            <div className="row">
              <InputFeild
                type="text"
                disabled={true}
                label={
                  language === "En"
                    ? "Visited Employee Name"
                    : "اسم الموظف الذي تمت زيارته"
                }
                name="visitedEmployeeName"
                state={inputFeild}
                inputFeild={inputFeild.visitedEmployeeName}
                self={this}
              />
              <InputFeild
                type="text"
                disabled={true}
                label={
                  language === "En"
                    ? "Visited Employee ID"
                    : "معرف الموظف الذي تمت زيارته"
                }
                name="visitedEmployeeID"
                state={inputFeild}
                inputFeild={inputFeild.visitedEmployeeID}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                disabled={true}
                label={
                  language === "En"
                    ? "Visited Employee Entity"
                    : "تمت زيارة كيان الموظف"
                }
                name="visitedEmployeeEntity"
                state={inputFeild}
                inputFeild={inputFeild.visitedEmployeeEntity}
                self={this}
              />
              <InputFeild
                type="text"
                disabled={true}
                label={
                  language === "En"
                    ? "Visited Employee Phone"
                    : "تمت زيارة هاتف الموظف"
                }
                name="visitedEmployeePhone"
                state={inputFeild}
                inputFeild={inputFeild.visitedEmployeePhone}
                self={this}
              />
            </div>
            <div className="row mb-4">
              <InputFeild
                type="text"
                disabled={true}
                label={language === "En" ? "Grade" : "درجة"}
                name="visitedEmployeeGrade"
                state={inputFeild}
                inputFeild={inputFeild.visitedEmployeeGrade}
                self={this}
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              Visitor Information
            </div>
            <div className="row">
              <InputFeild
                self={this}
                disabled={true}
                type="text"
                label={language === "En" ? "Visitor Name" : "اسم الزائر"}
                name="visitorName"
                state={inputFeild}
                inputFeild={inputFeild.visitorName}
              />
              <InputFeild
                self={this}
                type="text"
                disabled={true}
                label={
                  language === "En" ? "Mobile Number" : "رقم الهاتف المحمول"
                }
                name="visitorMobileNumber"
                state={inputFeild}
                inputFeild={inputFeild.visitorMobileNumber}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                disabled={true}
                label={language === "En" ? "Email ID" : "عنوان الايميل"}
                name="visitorEmailId"
                state={inputFeild}
                inputFeild={inputFeild.visitorEmailId}
              />
              <InputFeild
                type="select"
                disabled={true}
                label={language === "En" ? "Nationality" : "جنسية"}
                name="visitorNationality"
                options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.visitorNationality}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="datetime-local"
                disabled={true}
                label={
                  language === "En"
                    ? "Anticipated Visit Time"
                    : "وقت الزيارة المتوقع"
                }
                name="visitorVisitTime"
                state={inputFeild}
                inputFeild={inputFeild.visitorVisitTime}
                self={this}
              />
              <InputFeild
                type="select"
                disabled={true}
                label={
                  language === "En"
                    ? "Related Org/Company"
                    : "المؤسسة/الشركة ذات الصلة"
                }
                name="visitorRelatedOrg"
                options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.visitorRelatedOrg}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="select"
                disabled={true}
                label={language === "En" ? "Purpose of Visit" : "غرض الزيارة"}
                name="visitorPurposeOfVisit"
                options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.visitorPurposeOfVisit}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="file"
                disabled={true}
                label={
                  language === "En" ? "Attach ID Proof" : "إرفاق إثبات الهوية"
                }
                name="visitorIdProof"
                self={this}
                state={visitorIdProof}
                fileData={visitorIdProof}
                handleFileChange={(event: any) => {
                  this.setState({
                    visitorIdProof: event.target.files,
                  });
                }}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {visitorIdProof && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {visitorIdProof[0]?.name}
                    </span>
                    <span
                      className="px-3 py-2 bg-danger text-white fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ visitorIdProof: "" });
                      }}
                    >
                      X
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <InputFeild
                type="file"
                disabled={true}
                label={
                  language === "En"
                    ? "Attach Visitor Photograph"
                    : "إرفاق صورة الزائر"
                }
                name="visitorPhoto"
                state={visitorPhoto}
                fileData={visitorPhoto}
                self={this}
                handleFileChange={(event: any) => {
                  this.setState({
                    visitorPhoto: event.target.files,
                  });
                }}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {visitorPhoto && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {visitorPhoto[0]?.name}
                    </span>
                    <span
                      className="px-3 py-2 bg-danger text-white fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ visitorPhoto: "" });
                      }}
                    >
                      X
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <InputFeild
                type="radio"
                disabled={true}
                label={
                  language === "En"
                    ? "Notify the requestor by SMS"
                    : "إشعار مقدم الطلب عن طريقالرسائل القصيرة"
                }
                name="visitorNotify"
                state={inputFeild}
                inputFeild={inputFeild.visitorNotify}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                disabled={true}
                type="text"
                label={language === "En" ? "Remarks" : "ملاحظات"}
                name="visitorRemarks"
                state={inputFeild}
                inputFeild={inputFeild.visitorRemarks}
              />
            </div>

            <div className="d-flex justify-content-end mb-2 gap-3">
              <button
                className="px-4 py-2"
                style={{ backgroundColor: "#E5E5E5" }}
                onClick={() => {
                  self.setState({ isHomeActive: true });
                  window.history.go(-1);
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 text-white"
                style={{ backgroundColor: "#223771" }}
                type="submit"
                onClick={() => {
                  this.onSubmit();
                }}
              >
                Checkout
              </button>
            </div>
          </form>
        </div>
      </CommunityLayout>
    );
  }
}
