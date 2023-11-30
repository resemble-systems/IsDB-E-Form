  import * as React from 'react';
import styles from './VisitRequestFormReceptionist.module.sass';
import type { IVisitRequestFormReceptionistProps } from './IVisitRequestFormReceptionistProps';
import CommunityLayout from "../../../common-components/communityLayout/index";
// import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
import { Select } from "antd";
import InputFeild from "./InputFeild";
import "./index.css";
import { SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
 } from "@microsoft/sp-http";
import { MSGraphClientV3 } from "@microsoft/sp-http";

interface IVisitRequestFormReceptionistState {
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
 
}

export default class VisitorsForm extends React.Component<
IVisitRequestFormReceptionistProps,
IVisitRequestFormReceptionistState
> {
  public constructor(props: IVisitRequestFormReceptionistProps, state: IVisitRequestFormReceptionistState) {
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
     
    };
  }
  public componentDidMount() {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    this.getDetails();
    this.getVisitRequest();
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
        Filledby:context.pageContext.user.displayName,
        Filledbytype:"Receptionist",
        Consecutive: this.state.consecutive.toString(),
        Sheduledtime: this.state.sheduledTime.toString(),
      }),
    };
    const postResponse = await context.spHttpClient.post(
      `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('VisitorRequestForm')/items`,
      SPHttpClient.configurations.v1,
      spHttpClintOptions
    );
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log("visitor Created", postData);
      // setTimeout(() => {
      //   console.log("visitor request form success");
      // }, 1000);
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

  public componentDidUpdate(
    prevProps: Readonly<IVisitRequestFormReceptionistProps>,
    prevState: Readonly<IVisitRequestFormReceptionistState>,
    snapshot?: any
  ): void {
    if (
      prevState.inputFeild.visitorVisitTime !==
      this.state.inputFeild.visitorVisitTime
    ) {
      const startTime = 9 * 60 + 15;
      const endTime = 15 * 60 + 30;
      console.log("componentDidUpdate");
      if (
        new Date(this.state.inputFeild.visitorVisitTime).getHours() * 60 +
          new Date(this.state.inputFeild.visitorVisitTime).getMinutes() >
          startTime &&
        new Date(this.state.inputFeild.visitorVisitTime).getHours() * 60 +
          new Date(this.state.inputFeild.visitorVisitTime).getMinutes() <
          endTime
      ) {
        const properVisitTime = true;
        console.log("properVisitTime", properVisitTime);
        this.setState({
          sheduledTime: properVisitTime,
        });
      }
    }
  }

  public getDetails() {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`/me`)
          .version("v1.0")
          .select("*"
            // "department,jobTitle,displayName,mobilePhone,officeLocation"
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
                // email: user.userPrincipalName,
                Department: user.department,
                // jobTitle: user.jobTitle,
                 officeNumber:user.mobilePhone,
                mobileNumber:user.mobilePhone,
                officeLocation:user.officeLocation,
              },
            });
          });
      });
  }
  public getVisitRequest() {
    const { context } = this.props;
    console.log("GET Data");

    context.spHttpClient
      .get(
        `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('VisitorRequestForm')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((listItems: any) => {
        console.log("VisitorRequestForm", listItems);

        const sortedItems: any = listItems.value.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        console.log("sortedItems", sortedItems);
        let filterMyData = listItems.value.filter(
          (e: any) =>
            e.Filledby.toLowerCase() ===
            context.pageContext.user.displayName.toLowerCase()
        );
        console.log(
          "Context Details",
          context.pageContext.user.displayName,
          context
        );
        console.log(filterMyData, "filtered data");

        const consecutiveVisit = filterMyData?.filter(
          (data: { Visitorvisithour: string | number }) => {
            return (
              new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) <
              new Date(data.Visitorvisithour)
            );
          }
        );
        console.log(consecutiveVisit, "consecutiveVisit");
        const isConsecutiveVisit = consecutiveVisit?.length >= 2;
        console.log("isConsecutiveVisit", isConsecutiveVisit);
        this.setState({
          consecutive: isConsecutiveVisit,
        });
      });
  }
  public getNames(nameSearch: string) {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`/me/people/?$search=${nameSearch}`)
          .version("v1.0")
          .select("*")
          .top(20)
          .get((error: any, mail: any, rawResponse?: any) => {
            if (error) {
              console.log("nameSearch messages Error", error);
              return;
            }

            console.log("nameSearch Response", mail);
            const nameData = mail.value.map(
              (data: { displayName: string; userPrincipalName: string }) => {
                return {
                  value: data.displayName,
                  label: data.displayName,
                  email: data.userPrincipalName,
                };
              }
            );

            console.log("nameData", nameData);

            this.setState({ nameOptions: nameData });
          });
      });
  }
  public render(): React.ReactElement<IVisitRequestFormReceptionistProps> {
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
    const {
      inputFeild,
      visitorIdProof,
      visitorPhoto,
      language,
      checkBox,
      nameOptions,
      nameSelected,
      
    } = this.state;
    const { context, self,  } = this.props;
    const handleSubmit = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      console.log("Form Data", event);
      console.log("Form Submit", inputFeild, visitorIdProof, visitorPhoto);
    };
    const handleSearch = (newValue: string) => {
      let nameSearch = newValue;

      console.log("nameSearch", nameSearch);

      if (nameSearch.length >= 3) {
        this.getNames(nameSearch);
      }
    };

    const handleChange = (newValue: string) => {
      console.log("newValue", newValue);

      this.setState({ nameSelected: newValue });
    };
    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Visitor Access Management"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            {/* {filledBy === "Receptionist Task View" ? (
              <> Visit Request ({filledBy})</>
            ) : (
              <> Visit Request Form ({filledBy})</>
            )} */}
            Visit Request Form (if filled by employee)
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
              className={`border border-2 ${styles.announcementsFilterInput}`}
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
                label={language === "En" ? "Staff Name" : "اسم الموظفين"}
                name="staffName"
                state={inputFeild}
                inputFeild={inputFeild.staffName}
              />
              <InputFeild
                type="text"
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
                label={language === "En" ? "ID Number" : "رقم الهوية"}
                name="staffId"
                state={inputFeild}
                inputFeild={inputFeild.staffId}
                self={this}
              />
              <InputFeild
                type="text"
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
                label={language === "En" ? "Office Location" : "موقع المكتب"}
                name="officeLocation"
                state={inputFeild}
                inputFeild={inputFeild.officeLocation}
                self={this}
              />
              <InputFeild
                type="text"
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
            <div className="d-flex">
                <div
                  className="d-flex justify-content-between"
                  style={{
                    fontSize: "1em",
                    fontFamily: "Open Sans",
                    fontWeight: "600",
                    width: "24.5%",
                    backgroundColor: "#F0F0F0",
                  }}
                >
                  <label className="ps-2 py-2" htmlFor="onBehalfOf">
                    {language === "En" ? "On behalf of" : "باسم"}
                  </label>
                  <input
                    style={{
                      marginLeft: "13px",
                      marginTop: "5px",
                      width: "25px",
                      height: "25px",
                      borderRadius: "6px",
                    }}
                    className="form-check"
                    type="checkbox"
                    checked={checkBox}
                    onChange={(event) => {
                      this.setState({
                        checkBox: event.target.checked,
                      });
                    }}
                  />
                </div>

                <Select
                  className="flex-fill"
                  id="onBehalfOf"
                  showSearch
                  value={nameSelected}
                  disabled={!checkBox}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={handleSearch}
                  onChange={handleChange}
                  notFoundContent={null}
                  options={(nameOptions || []).map((data: any) => ({
                    value: data.value,

                    label: data.label,
                  }))}
                />
              </div>
            </div>
            {checkBox && (
              <div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              Visited Employee Information
            </div>
            
  
            <div className="row">
              <InputFeild
                type="text"
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
                label={language === "En" ? "Grade" : "درجة"}
                name="visitedEmployeeGrade"
                state={inputFeild}
                inputFeild={inputFeild.visitedEmployeeGrade}
                self={this}
              />
            </div>
            </div>
  )}
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              Visitor Information
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label={language === "En" ? "Visitor Name" : "اسم الزائر"}
                name="visitorName"
                state={inputFeild}
                inputFeild={inputFeild.visitorName}
              />
              <InputFeild
                self={this}
                type="text"
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
                label={language === "En" ? "Email ID" : "عنوان الايميل"}
                name="visitorEmailId"
                state={inputFeild}
                inputFeild={inputFeild.visitorEmailId}
              />
              <InputFeild
                type="select"
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
                type="text"
                label={
                  language === "En"
                    ? "Related Org/Company"
                    : "المؤسسة/الشركة ذات الصلة"
                }
                name="visitorRelatedOrg"
                // options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.visitorRelatedOrg}
                self={this}
              />
              <InputFeild
                type="datetime-local"
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
            </div>
            <div className="row">
            <InputFeild
                type="customradio"
                label={language === "En" ? "Purpose of Visit" : "غرض الزيارة"}
                name="visitorPurposeOfVisit"
               
                state={inputFeild}
                inputFeild={inputFeild.visitorPurposeOfVisit}
                self={this}
              />
             
            </div>
            <div className="row">
              <InputFeild
                type="file"
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
