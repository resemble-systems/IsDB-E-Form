import * as React from "react";
import type { IVisitRequestBlockListViewProps } from "./IVisitRequestBlockListViewProps";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { SPComponentLoader } from "@microsoft/sp-loader";
import InputFeild from "./InputFeild";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { Select } from "antd";

interface IVisitRequestBlockListViewState {
  inputFeild: any;
  visitorIdProof: any;
  visitorPhoto: any;
  language: any;
}

export default class VisitRequestBlockListView extends React.Component<
  IVisitRequestBlockListViewProps,
  IVisitRequestBlockListViewState
> {
  public constructor(
    props: IVisitRequestBlockListViewProps,
    state: IVisitRequestBlockListViewState
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
      language: "En",
    };
  }
  public componentDidMount() {
    this.getDetails();
  }
  public onSubmit = async () => {
    const { context } = this.props;
    const { inputFeild } = this.state;
    const headers: any = {
      "X-HTTP-Method": "POST",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Title: inputFeild.staffName,
        Grade: inputFeild.grade,
        Staff_id: inputFeild.staffId,
        Department: inputFeild.Department,
        OfficeLocation: inputFeild.officeLocation,
        Officephone: inputFeild.officeNumber,
        Mobilenumber: inputFeild.mobileNumber,
        Immediatesupervisor: inputFeild.immediateSupervisor,
        Onbehalfof: inputFeild.onBehalfOf,
        Visitedemployee: inputFeild.visitedEmployeeName,
        Visitedemployeeid: inputFeild.visitedEmployeeID,
        Visitedentity: inputFeild.visitedEmployeeEntity,
        Visitedemployeephone: inputFeild.visitedEmployeePhone,
        Visitedemployeestaffgrade: inputFeild.visitedEmployeeGrade,
        Visitorname: inputFeild.visitorName,
        Visitormobileno: inputFeild.visitorMobileNumber,
        Visitoremailaddress: inputFeild.visitorEmailId,
        Visitornationality: inputFeild.visitorNationality,
        Visitororgtype: inputFeild.visitorOrgType,
        Visitorrelatedorganization: inputFeild.visitorRelatedOrg,
        Visitorpurposeofvisit: inputFeild.visitorPurposeOfVisit,
        Visitorvisithour: inputFeild.visitorVisitTime,
        Visitornotify: inputFeild.visitorNotify,
        Visitorremarks: inputFeild.visitorRemarks,
        Filledby: context.pageContext.user.displayName,
        Filledbytype: "Blacklist",
      }),
    };
    const postResponse = await context.spHttpClient.post(
      `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('BlackList')/items`,
      SPHttpClient.configurations.v1,
      spHttpClintOptions
    );
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log("visitor Created", postData);
    } else {
      alert("visitor form Failed.");
      console.log("Post Failed", postResponse);
    }
    this.setState({
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
    });
  };
  public getDetails() {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`/users/${context.pageContext.user.email}`)
          .version("v1.0")
          .select(
            "*"
          
          )

          .get((error: any, user: any, rawResponse?: any) => {
            if (error) {
              console.log("User Error Msg:", error);

              return;
            }

            console.log("Selected User Details", user);

            this.setState({
              inputFeild: {
                ...InputFeild,
                staffName: user.displayName,
               
                Department: user.department,
              
                officeNumber: user.mobilePhone,
                mobileNumber: user.mobilePhone,
                officeLocation: user.officeLocation,
              },
            });
          });
      });
  }
  public render(): React.ReactElement<IVisitRequestBlockListViewProps> {
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
    const { context } = this.props;
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
           
            Visitor Request (Receptionist Task View)
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
                type="text"
                autocomplete="off"
                label={language === "En" ? "Staff Name" : "اسم الموظفين"}
                name="staffName"
                state={inputFeild}
                inputFeild={inputFeild.staffName}
              />
              <InputFeild
                type="text"
                label={language === "En" ? "Grade" : "درجة"}
                name="grade"
                autocomplete="off"
                state={inputFeild}
                inputFeild={inputFeild.grade}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                autocomplete="off"
                label={language === "En" ? "ID Number" : "رقم الهوية"}
                name="staffId"
                state={inputFeild}
                inputFeild={inputFeild.staffId}
                self={this}
              />
              <InputFeild
                type="text"
                autocomplete="off"
                label={language === "En" ? "Department" : "قسم "}
                name="Department"
                state={inputFeild}
                inputFeild={inputFeild.Department}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                autocomplete="off"
                label={language === "En" ? "Office Location " : "موقع المكتب "}
                name="officeLocation"
                state={inputFeild}
                inputFeild={inputFeild.officeLocation}
                self={this}
              />
              <InputFeild
                type="text"
                label={language === "En" ? "Office Number" : " مكتب نومبر "}
                autocomplete="off"
                name="officeNumber"
                state={inputFeild}
                inputFeild={inputFeild.officeNumber}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                autocomplete="off"
                label={language === "En" ? "Mobile Number " : "رقم الموبايل "}
                name="mobileNumber"
                state={inputFeild}
                inputFeild={inputFeild.mobileNumber}
                self={this}
              />
              <InputFeild
                type="text"
                label={
                  language === "En" ? "Immediate Supervisor" : "المشرف المباشر"
                }
                autocomplete="off"
                name="immediateSupervisor"
                state={inputFeild}
                inputFeild={inputFeild.immediateSupervisor}
                self={this}
              />
            </div>
            <div className="row mb-4">
              <InputFeild
                type="text"
                label={language === "En" ? "On behalf of" : "نيابة عن "}
                autocomplete="off"
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
                autocomplete="off"
                label={
                  language === "En"
                    ? "Visited Employee Name "
                    : "اسم الموظف الذي تمت زيارته "
                }
                name="visitedEmployeeName"
                state={inputFeild}
                inputFeild={inputFeild.visitedEmployeeName}
                self={this}
              />
              <InputFeild
                type="text"
                label={
                  language === "En"
                    ? "Visited Employee ID"
                    : "هوية الموظف الذي تمت زيارته"
                }
                autocomplete="off"
                name="visitedEmployeeID"
                state={inputFeild}
                inputFeild={inputFeild.visitedEmployeeID}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                autocomplete="off"
                label={
                  language === "En"
                    ? "Visited Employee Entity"
                    : "الجهة التي تمت زيارتها"
                }
                name="visitedEmployeeEntity"
                state={inputFeild}
                inputFeild={inputFeild.visitedEmployeeEntity}
                self={this}
              />
              <InputFeild
                type="text"
                autocomplete="off"
                label={
                  language === "En"
                    ? "Visited Employee Phone"
                    : "هاتف الموظف الذي تمت زيارته"
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
                autocomplete="off"
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
            <div
              className="d-flex justify-content-start text-danger py-2 mb-4 headerText"
              style={{ backgroundColor: "#C8CDDB" }}
            >
              * Blacklisted visitor
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                autocomplete="off"
                label={language === "En" ? "Visitor Name" : "اسم الزائر"}
                name="visitorName"
                state={inputFeild}
                inputFeild={inputFeild.visitorName}
              />
              <InputFeild
                self={this}
                type="text"
                autocomplete="off"
                label={language === "En" ? "Mobile Number " : "رقم الموبايل "}
                name="visitorMobileNumber"
                state={inputFeild}
                inputFeild={inputFeild.visitorMobileNumber}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                autocomplete="off"
                label={
                  language === "En" ? "Email ID" : "معرف البريد الإلكتروني"
                }
                name="visitorEmailId"
                state={inputFeild}
                inputFeild={inputFeild.visitorEmailId}
              />
              <InputFeild
                type="select"
                label={language === "En" ? "Nationality" : "جنسية"}
                autocomplete="off"
                name="visitorNationality"
                options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.visitorNationality}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="select"
                autocomplete="off"
                
                label={language === "En" ? "Organization Type" : "نوع المنظمة"}
                name="visitorOrgType"
                options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.visitorOrgType}
                self={this}
              />
              <InputFeild
                type="select"
                autocomplete="off"
                label={
                  language === "En"
                    ? "Related Org/Company"
                    : "المؤسسة / الشركة ذات الصلة"
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
                autocomplete="off"
                label={
                  language === "En" ? "Purpose of Visit" : "الغرض من الزيارة"
                }
                name="visitorPurposeOfVisit"
                options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.visitorPurposeOfVisit}
                self={this}
              />
              <InputFeild
                type="date"
                label={
                  language === "En"
                    ? "Anticipated Visit Time"
                    : "وقت الزيارة المتوقع"
                }
                autocomplete="off"
                name="visitorVisitTime"
                state={inputFeild}
                inputFeild={inputFeild.visitorVisitTime}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="file"
                label={
                  language === "En" ? "Attach ID Proof" : "إرفاق إثبات الهوية"
                }
                autocomplete="off"
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
                label={
                  language === "En"
                    ? "Attach Visitor Photograph"
                    : "إرفاق صورة الزائر"
                }
                name="visitorPhoto"
                state={visitorPhoto}
                autocomplete="off"
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
                autocomplete="off"
                label={
                  language === "En"
                    ? "Notify the requestor by SMS"
                    : "إخطار مقدم الطلب عن طريق الرسائل القصيرة"
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
                type="text"
                autocomplete="off"
                label={language === "En" ? "Remarks " : "ملاحظات "}
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
                Submit
              </button>
             
            </div>
          </form>
        </div>
      </CommunityLayout>
    );
  }
}
