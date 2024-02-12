import * as React from "react";
import styles from "./ContractForm.module.sass";
import type { IContractFormProps } from "./IContractFormProps";
import InputFeild from "./InputFeild";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { Select } from "antd";
import { Web } from "sp-pnp-js";
import "./index.css";
import {
  SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
} from "@microsoft/sp-http";

interface IContractFormState {
  inputFeild: any;
  requestorIdProof: any;
  requestorPhoto: any;
  requestorContract: any;
  language: any;
  postAttachments: any;
  attachmentJson: any;
  requestorIdProofJSON: any;
  requestorPhotoJSON: any;
  requestorContractJSON: any;
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
        contractCompany: "Short Term Contractor",
        requestorName: "",
        requestorMobileNo: "",
        requestorNationality: "India",
        requestorPurposeOfContract: "Construction Work",
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
      requestorIdProofJSON: {},
      requestorPhotoJSON: {},
      requestorContractJSON: {},
    };
  }
  public componentDidMount() {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    this.getDetails();
    if (window.location.href.indexOf("?itemID") != -1) {
      context.spHttpClient
        .get(
          `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('Contractor-Form')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
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
              phoneExtension: listItems?.phoneExtension,
              mobileNumber: listItems?.Mobilenumber,
              requestType: listItems?.requestType,
              idType: listItems?.idType,
              idNumber: listItems?.idNumber,
              contractCompany: listItems?.contractCompany,
              requestorName: listItems?.requestorName,
              requestorMobileNo: listItems?.requestorMobileNo,
              requestorNationality: listItems?.requestorNationality,
              requestorPurposeOfContract: listItems?.requestorPurposeOfContract,
              requestorNationalId: listItems?.requestorNationalId,
              requestorNationalIdExpiryDate:
                listItems?.requestorNationalIdExpiryDate,
              requestorJobTittle: listItems?.requestorJobTittle,
              requestorLocationOfWork: listItems?.requestorLocationOfWork,
              requestorRelatedEdu: listItems?.requestorRelatedEdu,
              requestorRelatedDept: listItems?.requestorRelatedDept,
              requestorValidityFrom: listItems?.requestorValidityFrom,
              requestorValidityTo: listItems?.requestorValidityTo,
              requestorRemarks: listItems?.requestorRemarks,
            },
            requestorContract: listItems.AttachmentJSON
              ? JSON.parse(listItems.AttachmentJSON)
                  ?.filter(
                    (data: any) => data.targetName === "requestorContract"
                  )
                  ?.map((data: any) => {
                    return {
                      ...data,
                      ID: listItems.ID,
                    };
                  })
              : [],
            requestorPhoto: listItems.AttachmentJSON
              ? JSON.parse(listItems.AttachmentJSON)
                  ?.filter((data: any) => data.targetName === "requestorPhoto")
                  ?.map((data: any) => {
                    return {
                      ...data,
                      ID: listItems.ID,
                    };
                  })
              : [],
            requestorIdProof: listItems.AttachmentJSON
              ? JSON.parse(listItems.AttachmentJSON)
                  ?.filter(
                    (data: any) => data.targetName === "requestorIdProof"
                  )
                  ?.map((data: any) => {
                    return {
                      ...data,
                      ID: listItems.ID,
                    };
                  })
              : [],
          });
        });
    }
  }

  public getDetails() {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`/users/${context.pageContext.user.email}`)
          .version("v1.0")
          .select("*")

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
    const { inputFeild, postAttachments,requestorIdProof,requestorPhoto } = this.state;

    const validityFrom = this.state.inputFeild.requestorValidityFrom;
    const validityTo = this.state.inputFeild.requestorValidityTo;
    const nationalIDExpiryDate =
      this.state.inputFeild.requestorNationalIdExpiryDate;
    console.log(
      "nationalIDExpiryDate",
      nationalIDExpiryDate,
      validityFrom,
      validityTo
    );
    const checkMobileNo = (Number: any) => {
      const mobileNumberRegex = /^(\+[\d]{1,5}|0)?[1-9]\d{9}$/;
      const isValidNumber = !mobileNumberRegex.test(Number);
      return isValidNumber;
    };
    const checkID = (ID: any) => {
      var regex = /^[0-9]+$/;
      const isValidID = regex.test(ID);
      return !isValidID;
    };

    if (!inputFeild.idNumber) {
      alert("Please enter the ID!");
    } else if (checkID(inputFeild.idNumber)) {
      alert("Invalid ID!");
    } else if (!inputFeild.requestorName) {
      alert("Please enter the Name!");
    } else if (
      !inputFeild.requestorNationalId ||
      inputFeild.requestorNationalId?.length < 3 ||
      inputFeild.requestorNationalId?.length > 30
    ) {
      alert(
        "National ID cannot be blank, should have more than 2 characters and less than 30 characters!"
      );
    } else if (!inputFeild.requestorMobileNo) {
      alert("Mobile Number cannot be blank!");
    } else if (checkMobileNo(inputFeild.requestorMobileNo)) {
      alert("Invalid Mobile Number!");
      // } else if (!inputFeild.requestorJobTittle) {
      //   alert("Please enter the Job title!");
    } else if (
      !inputFeild.requestorRelatedEdu ||
      inputFeild.requestorRelatedEdu?.length < 3 ||
      inputFeild.requestorRelatedEdu?.length > 30
    ) {
      alert(
        "Related Org/Company cannot be blank, should have more than 2 characters and less than 30 characters!"
      );
    } else if (!inputFeild.requestorRelatedDept) {
      alert("Please enter the Related Department!");
    } else if (!validityFrom) {
      alert("Please enter the From date!");
    } else if (!validityTo) {
      alert("Please enter the To date!");
    } else if (
      validityFrom &&
      validityTo &&
      new Date(validityFrom) > new Date(validityTo)
    ) {
      alert("Validity From must be earlier than Validity To");
    } else if (!nationalIDExpiryDate) {
      alert("Please enter the National ID expiry date!");
    }else if(!requestorIdProof) {
      alert("Please Attach the IdProof!");
    
    }else if(!requestorPhoto) {
      alert("Please Attach the Photo!")
    }else {
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
          requestorNationalIdExpiryDate:
            inputFeild.requestorNationalIdExpiryDate,
          requestorJobTittle: inputFeild.requestorJobTittle,
          requestorLocationOfWork: inputFeild.requestorLocationOfWork,
          requestorRelatedEdu: inputFeild.requestorRelatedEdu,
          requestorRelatedDept: inputFeild.requestorRelatedDept,
          requestorValidityFrom: new Date(
            inputFeild.requestorValidityFrom
          ).toString(),
          requestorValidityTo: new Date(
            inputFeild.requestorValidityTo
          ).toString(),
          requestorRemarks: inputFeild.requestorRemarks,
          AttachmentJSON: JSON.stringify(this.state.attachmentJson),
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
        this.upload(postData.ID, postAttachments);
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
          requestType: "Trainee",
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
    }
  };

  public componentDidUpdate(
    prevProps: Readonly<IContractFormProps>,
    prevState: Readonly<IContractFormState>
  ): void {
    const { requestorContractJSON, requestorIdProofJSON, requestorPhotoJSON } =
      this.state;
    if (prevState.postAttachments !== this.state.postAttachments) {
      const attachmentPostJson = [
        requestorPhotoJSON,
        requestorIdProofJSON,
        requestorContractJSON,
      ]?.filter((data: any) => {
        if (Object.keys(data)?.length > 0) {
          return data;
        }
      });
      this.setState({
        attachmentJson: attachmentPostJson,
      });
    }
  }
  public async upload(ID: number, Attachment: any) {
    console.log("In Attachment Post", Attachment);
    const postAttachment = [
      ...Attachment.requestorContract,
      ...Attachment.requestorPhoto,
      ...Attachment.requestorIdProof,
    ];
    console.log("postAttachment", postAttachment);
    const uniqueAttachmentData = postAttachment?.reduce(
      (acc: any, curr: any) => {
        if (!acc.find((item: { name: string }) => item.name === curr.name)) {
          acc.push(curr);
        }
        return acc;
      },
      []
    );
    console.log("uniqueAttachmentData", uniqueAttachmentData);
    let web = new Web(this.props.context.pageContext.web.absoluteUrl);
    const postResponse = await web.lists
      .getByTitle("Contractor-Form")
      .items.getById(ID)
      .attachmentFiles.addMultiple(uniqueAttachmentData);
    console.log("Attachment Post Status", postResponse);
    window.history.go(-1);
  }

  public render(): React.ReactElement<IContractFormProps> {
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
      requestorContract,
      requestorIdProof,
      requestorPhoto,
      language,
      postAttachments,
      requestorContractJSON,
      requestorIdProofJSON,
      requestorPhotoJSON,
      attachmentJson,
    } = this.state;
    const { context } = this.props;
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
        const regex = /\.(pdf|PDF|jpg|jpeg|png|gif)$/i;
        if (!regex.test(fileName)) {
          alert("Please select an Valid File.");
        } else {
          if (targetName === "requestorIdProof") {
            this.setState({
              requestorIdProof: event.target.files,
              requestorIdProofJSON: {
                targetName: targetName,
                fileName: fileName,
              },
            });
          } else if (targetName === "requestorPhoto") {
            this.setState({
              requestorPhoto: event.target.files,
              requestorPhotoJSON: {
                targetName: targetName,
                fileName: fileName,
              },
            });
          } else if (targetName === "requestorContract") {
            this.setState({
              requestorContract: event.target.files,
              requestorContractJSON: {
                targetName: targetName,
                fileName: fileName,
              },
            });
          }
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
    console.log(
      "Target Name",
      requestorIdProofJSON,
      requestorContractJSON,
      requestorPhotoJSON,
      attachmentJson
    );

    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle=" Trainee Contractor Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Trainee/Contract Form(Trainee)
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
              {language === "En"
                ? "Requestor Information"
                : "معلومات مقدم الطلب"}
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label={language === "En" ? "Staff Name" : "اسم الموظفين"}
                name="staffName"
                state={inputFeild}
                disabled={true}
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
                disabled={true}
                label={
                  language === "En" ? "Phone Extension " : "تحويلة الهاتف "
                }
                name="phoneExtension"
                state={inputFeild}
                inputFeild={inputFeild.phoneExtension}
                self={this}
              />
              <InputFeild
                disabled={true}
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
              {language === "En" ? "Request Information" : "طلب معلومات"}
            </div>
            <div className="row">
              <InputFeild
                type="select"
                label={
                  <>
                    {language === "En" ? "Request Type " : "نوع الطلب "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestType"
                options={[
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
                label={
                  <>
                    {language === "En" ? "ID Type " : "نوع الهوية "}
                    <span className="text-danger">*</span>
                  </>
                }
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
                label={
                  <>
                    {language === "En" ? "ID Number " : "رقم الهوية "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="idNumber"
                state={inputFeild}
                inputFeild={inputFeild.idNumber}
                self={this}
              />
              <InputFeild
                type="select"
                label={
                  <>
                    {language === "En" ? "Contract Company " : "شركة متعاقدة "}{" "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="contractCompany"
                options={["Short Term Contractor", "Long Term Contractor"]}
                state={inputFeild}
                inputFeild={inputFeild.contractCompany}
                self={this}
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En"
                ? "Contractor/Trainee Information"
                : "معلومات المقاول / المتدرب"}
            </div>
            <div className="row">
              <InputFeild
                type="text"
                label={
                  <>
                    {language === "En" ? "Name " : "اسم"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorName"
                state={inputFeild}
                inputFeild={inputFeild.requestorName}
                self={this}
              />
              <InputFeild
                type="text"
                label={
                  <>
                    {language === "En" ? "Mobile Number " : "رقم الموبايل "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorMobileNo"
                state={inputFeild}
                inputFeild={inputFeild.requestorMobileNo}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="select"
                label={
                  <>
                    {language === "En" ? "Nationality" : "جنسية"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorNationality"
                options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.requestorNationality}
                self={this}
              />
              <InputFeild
                type="select"
                label={
                  <>
                    {language === "En"
                      ? "Purpose of Contract "
                      : "الغرض من العقد "}{" "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorPurposeOfContract"
                options={[
                  "Construction Work",
                  "Technical work",
                  "Administrative work",
                ]}
                state={inputFeild}
                inputFeild={inputFeild.requestorPurposeOfContract}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label={
                  <>
                    {language === "En" ? "National ID " : "الرقم القومي "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorNationalId"
                state={inputFeild}
                inputFeild={inputFeild.requestorNationalId}
              />
              <InputFeild
                self={this}
                type="date"
                label={
                  <>
                    {language === "En"
                      ? "National ID Expiry date "
                      : "تاريخ انتهاء الهوية الوطنية "}{" "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorNationalIdExpiryDate"
                state={inputFeild}
                inputFeild={inputFeild.requestorNationalIdExpiryDate}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="select"
                options={["JT-1", "JT-2", "JT-3", "JT-4"]}
                label={
                  <>
                    {language === "En" ? "Job Title " : "وظيفة تيتل "}{" "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorJobTittle"
                state={inputFeild}
                inputFeild={inputFeild.requestorJobTittle}
              />
              <InputFeild
                self={this}
                type="text"
                label={
                  <>{language === "En" ? "Location of work " : "موقع العمل "}</>
                }
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
                  <>
                    {language === "En"
                      ? "Related Edu. Org. "
                      : "edu ذات الصلة. المؤسسة. "}{" "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorRelatedEdu"
                state={inputFeild}
                inputFeild={inputFeild.requestorRelatedEdu}
              />
              <InputFeild
                self={this}
                type="text"
                label={
                  <>
                    {language === "En" ? "Related Department " : "قسم ذات صلة"}{" "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorRelatedDept"
                state={inputFeild}
                inputFeild={inputFeild.requestorRelatedDept}
              />
            </div>
            <div className="row">
              <InputFeild
                type="date"
                label={
                  <>
                    {language === "En" ? "Validity From " : "الصلاحية من "}{" "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorValidityFrom"
                state={inputFeild}
                inputFeild={inputFeild.requestorValidityFrom}
                self={this}
              />
              <InputFeild
                type="date"
                label={
                  <>
                    {language === "En" ? "Validity To " : "الصلاحية إلى "}{" "}
                    <span className="text-danger">*</span>
                  </>
                }
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
                  <>
                    {language === "En" ? "Attach ID" : "إرفاق إثبات الهوية "}

                    <span className="text-danger">*</span>
                  </>
                }
                name="requestorIdProof"
                self={this}
                state={requestorIdProof}
                fileData={requestorIdProof}
                handleFileChange={handleChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {requestorIdProof?.length > 0 && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {requestorIdProof[0]?.name ||
                        requestorIdProof[0]?.fileName}
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
                  <>
                    {language === "En"
                      ? "Attach Photo"
                      : "إرفاق صورة فوتوغرافية "}
                    <span className="text-danger">*</span>
                  </>
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
                {requestorPhoto?.length > 0 && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {requestorPhoto[0]?.name || requestorPhoto[0]?.fileName}
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
                handleFileChange={handleChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {requestorContract?.length > 0 && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {requestorContract[0]?.name ||
                        requestorContract[0]?.fileName}
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
                type="textArea"
                label={language === "En" ? "Remarks " : "ملاحظات "}
                name="requestorRemarks"
                state={inputFeild}
                inputFeild={inputFeild.requestorRemarks}
              />
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
          </form>
        </div>
      </CommunityLayout>
    );
  }
}
