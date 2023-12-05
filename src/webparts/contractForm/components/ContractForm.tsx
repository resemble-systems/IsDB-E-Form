import * as React from "react";
import styles from "./ContractForm.module.sass";
import type { IContractFormProps } from "./IContractFormProps";
// import { escape } from '@microsoft/sp-lodash-subset';
import InputFeild from "./InputFeild";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { Select } from "antd";
import "./index.css";
import {
  SPHttpClient,
  ISPHttpClientOptions,
  // SPHttpClientResponse,
} from "@microsoft/sp-http";
interface IContractFormState {
  inputFeild: any;
  requestorIdProof: any;
  requestorPhoto: any;
  requestorContract: any;
  language: any;
  postAttachments: any;
  attachmentJson: any;
}

export default class ContractForm extends React.Component<
  IContractFormProps,
  IContractFormState
> {
  public constructor(props: IContractFormProps, state: IContractFormState) {
    super(props);
    this.state = {
      inputFeild: {
        staffName: "",
        grade: "",
        staffId: "",
        Department: "",
        phoneExtension: "",
        mobileNumber: "",
        requestType: "Trainee",
        idType: "New",
        idNumber: "",
        contractCompany: "",
        requestorName: "",
        requestorMobileNo: "",
        requestorNationality: "India",
        requestorPurposeOfContract: "",
        requestorNationalId: "",
        requestorNationalIdExpiryDate: "",
        requestorJobTittle: "",
        requestorLocationOfWork: "",
        requestorRelatedEdu: "",
        requestorRelatedDept: "",
        requestorValidityFrom: "",
        requestorValidityTo: "",
        requestorRemarks: "",
      },
      requestorIdProof: "",
      requestorPhoto: "",
      requestorContract: "",
      language: "En",
      postAttachments: [],
      attachmentJson: [],
    };
  }
  public componentDidMount() {
    // const { context } = this.props;
    // let data = window.location.href.split("=");
    // let itemId = data[data.length - 1];
    this.getDetails();
  }
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
                Department: user.department,
                phoneExtension: user.mobilePhone,
                mobileNumber: user.mobilePhone,
                officeLocation: user.officeLocation,
              },
            });
          });
      });
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
        // OfficeLocation: inputFeild.officeLocation,
        phoneExtension: inputFeild.phoneExtension,
        Mobilenumber: inputFeild.mobileNumber,
        requestType: inputFeild.requestType,
        idType: inputFeild.idType,
        idNumber: inputFeild.idNumber,
        contractCompany: inputFeild.contractCompany,
        requestorName: inputFeild.requestorName,
        requestorMobileNo: inputFeild.requestorMobileNo,
        requestorNationality: inputFeild.requestorNationality,
        requestorPurposeOfContract: inputFeild.requestorPurposeOfContract,
        requestorNationalId: inputFeild.requestorNationalId,
        requestorNationalIdExpiryDate: inputFeild.requestorNationalIdExpiryDate,
        requestorJobTittle: inputFeild.requestorJobTittle,
        requestorLocationOfWork: inputFeild.requestorLocationOfWork,
        requestorRelatedEdu: inputFeild.requestorRelatedEdu,
        requestorRelatedDept: inputFeild.requestorRelatedDept,
        requestorValidityFrom: inputFeild.requestorValidityFrom,
        requestorValidityTo: inputFeild.requestorValidityTo,
        requestorRemarks: inputFeild.requestorRemarks,
        // requestorIdProof: ,
        // requestorPhoto: "",
        // requestorContract: "",
      }),
    };
    console.log(inputFeild.requestType, "requestType");
    const postResponse = await context.spHttpClient.post(
      `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('Contractor-Form')/items`,
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
        phoneExtension: "",
        mobileNumber: "",
        requestType: "",
        idType: "",
        idNumber: "",
        contractCompany: "",
        requestorName: "",
        requestorMobileNo: "",
        requestorNationality: "",
        requestorPurposeOfContract: "",
        requestorNationalId: "",
        requestorNationalIdExpiryDate: "",
        requestorJobTittle: "",
        requestorLocationOfWork: "",
        requestorRelatedEdu: "",
        requestorRelatedDept: "",
        requestorValidityFrom: "",
        requestorValidityTo: "",
        requestorRemarks: "",
      },
      requestorIdProof: "",
      requestorPhoto: "",
      requestorContract: "",
    });
  };
  public render(): React.ReactElement<IContractFormProps> {
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
      requestorContract,
      requestorIdProof,
      requestorPhoto,
      language,
      postAttachments,
      attachmentJson,
    } = this.state;
    const { context, self } = this.props;
    const handleSubmit = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      console.log("Form Data", event);
      console.log(
        "Form Submit",
        inputFeild,
        requestorContract,
        requestorIdProof,
        requestorPhoto
      );
    };

    const handleChange = (event: { target: { name: any; files: any } }) => {
      console.log(`Attachment ${event.target.name}`, event.target.files);
      let inputArr = event.target.files;
      let arrLength = event.target.files?.length;
      const targetName = event.target.name;
      let fileData: any = [];
      for (let i = 0; i < arrLength; i++) {
        console.log(`In for loop ${i} times`);
        var file = inputArr[i];
        const fileName = inputArr[i].name;
        console.log("fileName", fileName);
        const regex = /\.(pdf|PDF)$/i;
        if (!regex.test(fileName)) {
          alert("Please select an PDF File.");
        } else {
          if (targetName === "requestorIdProof") {
            this.setState({
              requestorIdProof: event.target.files,
            });
          } else if (targetName === "requestorPhoto") {
            this.setState({
              requestorPhoto: event.target.files,
            });
          } else if (targetName === "requestorContract") {
            this.setState({
              requestorContract: event.target.files,
            });
          }
          this.setState({
            attachmentJson: [
              ...attachmentJson,
              { targetName: targetName, fileName: fileName },
            ],
          });
          var reader = new FileReader();
          reader.onload = (function (file) {
            return function (e) {
              fileData.push({
                name: file.name,
                content: e.target?.result,
                attachmentTarget: targetName,
              });
            };
          })(file);
          reader.readAsArrayBuffer(file);
          console.log("fileData Attachment", fileData);
          this.setState({
            postAttachments: {
              ...postAttachments,
              [event.target.name]: fileData,
            },
          });
        }
      }
    };

    console.log("Attachments", postAttachments);
    console.log("Target Name", attachmentJson);

    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Contractor Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Trainee/Contract Form
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

                  // selectOption: value === "Department Tasks" ? false : true,
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
                label={
                  language === "En" ? "Phone Extension " : "تحويلة الهاتف "
                }
                name="phoneExtension"
                state={inputFeild}
                inputFeild={inputFeild.phoneExtension}
                self={this}
              />
              <InputFeild
                type="text"
                label={language === "En" ? "Mobile Number " : "رقم الموبايل "}
                name="mobileNumber"
                state={inputFeild}
                inputFeild={inputFeild.mobileNumber}
                self={this}
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              Request Information
            </div>
            <div className="row">
              <InputFeild
                type="select"
                label={language === "En" ? "Request Type " : "نوع الطلب "}
                name="requestType"
                options={[
                  " ",
                  "Trainee",
                  "Short Term Contract",
                  "Long Term Contract",
                ]}
                state={inputFeild}
                inputFeild={inputFeild.requestType}
                self={this}
              />
              <InputFeild
                type="select"
                label={language === "En" ? "ID Type " : "نوع الهوية "}
                name="idType"
                options={["New", "Renewal", "Damaged", "Replacement"]}
                state={inputFeild}
                inputFeild={inputFeild.idType}
                self={this}
              />
            </div>
            <div className="row mb-4">
              <InputFeild
                type="text"
                label={language === "En" ? "ID Number " : "رقم الهوية "}
                name="idNumber"
                state={inputFeild}
                inputFeild={inputFeild.idNumber}
                self={this}
              />
              <InputFeild
                type="text"
                label={
                  language === "En" ? "Contract Company " : "شركة متعاقدة "
                }
                name="contractCompany"
                state={inputFeild}
                inputFeild={inputFeild.contractCompany}
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
                type="text"
                label={language === "En" ? "Name " : "اسم"}
                name="requestorName"
                state={inputFeild}
                inputFeild={inputFeild.requestorName}
                self={this}
              />
              <InputFeild
                type="text"
                label={language === "En" ? "Mobile Number " : "رقم الموبايل "}
                name="requestorMobileNo"
                state={inputFeild}
                inputFeild={inputFeild.requestorMobileNo}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="select"
                label={language === "En" ? "Nationality" : "جنسية"}
                name="requestorNationality"
                options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.requestorNationality}
                self={this}
              />
              <InputFeild
                type="text"
                label={
                  language === "En" ? "Purpose of Contract " : "الغرض من العقد "
                }
                name="requestorPurposeOfContract"
                state={inputFeild}
                inputFeild={inputFeild.requestorPurposeOfContract}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label={language === "En" ? "National ID " : "الرقم القومي "}
                name="requestorNationalId"
                state={inputFeild}
                inputFeild={inputFeild.requestorNationalId}
              />
              <InputFeild
                self={this}
                type="date"
                label={
                  language === "En"
                    ? "National ID Expiry date "
                    : "تاريخ انتهاء الهوية الوطنية "
                }
                name="requestorNationalIdExpiryDate"
                state={inputFeild}
                inputFeild={inputFeild.requestorNationalIdExpiryDate}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label={language === "En" ? "Job Tittle " : "وظيفة تيتل "}
                name="requestorJobTittle"
                state={inputFeild}
                inputFeild={inputFeild.requestorJobTittle}
              />
              <InputFeild
                self={this}
                type="text"
                label={language === "En" ? "Location of work " : "موقع العمل "}
                name="requestorLocationOfWork"
                state={inputFeild}
                inputFeild={inputFeild.requestorLocationOfWork}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label={
                  language === "En"
                    ? "Related Edu. Org. "
                    : "edu ذات الصلة. المؤسسة. "
                }
                name="requestorRelatedEdu"
                state={inputFeild}
                inputFeild={inputFeild.requestorRelatedEdu}
              />
              <InputFeild
                self={this}
                type="text"
                label={language === "En" ? "Related Dept. " : "قسم ذات صلة "}
                name="requestorRelatedDept"
                state={inputFeild}
                inputFeild={inputFeild.requestorRelatedDept}
              />
            </div>
            <div className="row">
              <InputFeild
                type="date"
                label={language === "En" ? "Validity From " : "الصلاحية من "}
                name="requestorValidityFrom"
                state={inputFeild}
                inputFeild={inputFeild.requestorValidityFrom}
                self={this}
              />
              <InputFeild
                type="date"
                label={language === "En" ? "Validity To " : "الصلاحية إلى "}
                name="requestorValidityTo"
                state={inputFeild}
                inputFeild={inputFeild.requestorValidityTo}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="file"
                label={
                  language === "En" ? "Attach ID Proof " : "إرفاق إثبات الهوية "
                }
                name="requestorIdProof"
                self={this}
                state={requestorIdProof}
                fileData={requestorIdProof}
                /* handleFileChange={(event: any) => {
                  this.setState({
                    requestorIdProof: event.target.files,
                  });
                }} */ handleFileChange={handleChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {requestorIdProof && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {requestorIdProof[0]?.name}
                    </span>
                    <span
                      className="px-3 py-2 bg-danger text-white fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ requestorIdProof: "" });
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
                    ? "Attach Photograph "
                    : "إرفاق صورة فوتوغرافية "
                }
                name="requestorPhoto"
                state={requestorPhoto}
                fileData={requestorPhoto}
                self={this}
                /* handleFileChange={(event: any) => {
                  this.setState({
                    requestorPhoto: event.target.files,
                  });
                }} */ handleFileChange={handleChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {requestorPhoto && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {requestorPhoto[0]?.name}
                    </span>
                    <span
                      className="px-3 py-2 bg-danger text-white fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ requestorPhoto: "" });
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
                    ? "Attach Contract / Letter "
                    : "إرفاق عقد / خطاب "
                }
                name="requestorContract"
                self={this}
                state={requestorContract}
                fileData={requestorContract}
                /* handleFileChange={(event: any) => {
                  this.setState({
                    requestorContract: event.target.files,
                  });
                }} */ handleFileChange={handleChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {requestorContract && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {requestorContract[0]?.name}
                    </span>
                    <span
                      className="px-3 py-2 bg-danger text-white fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ requestorContract: "" });
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
                    ? "SMS Reminder one week before expiry "
                    : "تذكير بالرسائل القصيرة قبل أسبوع واحد من انتهاء الصلاحية "
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
                label={language === "En" ? "Remarks " : "ملاحظات "}
                name="requestorRemarks"
                state={inputFeild}
                inputFeild={inputFeild.requestorRemarks}
              />
            </div>
            {/* <div className="d-flex justify-content-start py-2 mb-4">
              <input type="checkbox" />
              <label className="ps-2">
                <a href="#">I agree to Terms & Conditions</a>
              </label>
            </div> */}
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
              {/* {filledBy === "Receptionist Task View" ? (
                <button
                  className="px-4 py-2 text-white"
                  style={{ backgroundColor: "#223771" }}
                  type="submit"
                >
                  Send for Approval
                </button>
              ) : ( */}
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
              {/* )} */}
            </div>
          </form>
        </div>
      </CommunityLayout>
    );
  }
}