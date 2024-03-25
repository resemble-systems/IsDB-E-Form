import * as React from "react";
import type { IParkingRequestFormProps } from "./IParkingRequestFormProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import "./index.css";
import { Select } from "antd";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import RequestorInfo from "./inputComponents/RequestInfo";
import VehicleInfo from "./inputComponents/VehicleInfo";
import ParkingInfo from "./inputComponents/ParkingInfo";
import {
  SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Web } from "sp-pnp-js";
import { postData } from "../../../Services/Services";

interface IParkingRequestFormState {
  requestorInfo: any;
  parkingInfo: any;
  vehicleInfo: any;
  language: any;
  attachStaffID: any;
  attachCarRegistration: any;
  attachDriverID: any;
  postAttachments: any;
  attachmentJson: any;
  staffIdProofJSON: any;
  carRegistrationJSON: any;
  driverIdProofJSON: any;
  conditionCheckBox: any;
  disable: boolean;
  PendingWith:any;
}

export default class ParkingRequestForm extends React.Component<
  IParkingRequestFormProps,
  IParkingRequestFormState
> {
  public constructor(
    props: IParkingRequestFormProps,
    state: IParkingRequestFormState
  ) {
    super(props);
    this.state = {
      requestorInfo: {
        staffName: "",
        grade: "",
        staffId: "",
        Gender: "",
        staffExtension: "",
        hiringDate: "",
        jobCategory: "",
        department: "",
        mobileNumber: "",
        relatedEntity: "",
      },
      parkingInfo: {
        requestType: "Permanent Parking",
        requestedBuilding: "Permanent",
        parkingType: "Public",
        parkingArea: "Public",
        validityFrom: "",
        validityTo: "",
      },
      vehicleInfo: {
        carName: "",
        plateNumber: "",
        color: "",
        modelYear: "",
        comments: "",
      },
      language: "En",
      attachStaffID: "",
      attachCarRegistration: "",
      attachDriverID: "",
      postAttachments: [],
      attachmentJson: [],
      staffIdProofJSON: {},
      carRegistrationJSON: {},
      driverIdProofJSON: {},
      conditionCheckBox: false,
      disable: false,
      PendingWith:"SSIMS Reviewer",
    };
  }

  public componentDidMount() {
    // const { context } = this.props;
    this.getApprovers();
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];

    if (window.location.href.indexOf("?#viewitemID") != -1) {
      console.log("call the edit function....");
      this.getData(itemId);
      this.setState({
        disable: true,
      });
    }

    this.getDetails();
  }
  public getApprovers() {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('E-Form-approvers')/items`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((listItems: any) => {
        console.log("listitems", listItems);
      });
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
              requestorInfo: {
                ...RequestorInfo,
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

  public getData(itemId: any) {
    const { context } = this.props;
  
    // const {  parkingInfo, vehicleInfo } = this.state;
    console.log("Get data=====>");
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Parking-Request')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((listItems: any) => {
        this.setState({
          requestorInfo: {
            // ...requestorInfo,
            staffName: listItems?.Title,
            grade: listItems?.grade,
            staffId: listItems?.staffId,
            gender: listItems?.Gender,
            Department: listItems?.department,
            hiringDate: listItems?.hiringDate,
            jobCategory: listItems?.jobCategory,
            staffExtension: listItems?.staffExtension,
            mobileNumber: listItems?.mobileNumber,
            relatedEntity: listItems?.relatedEntity,
            PendingWith:listItems?.pendingWith
          },
          parkingInfo: {
            // ...parkingInfo,
            requestType: listItems?.requestType,
            requestedBuilding: listItems?.requestedBuilding,
            parkingType: listItems?.parkingType,
            parkingArea: listItems?.parkingArea,
            validityFrom: listItems?.validityFrom,
            validityTo: listItems?.validityTo,
          },
          vehicleInfo: {
            // ...vehicleInfo,
            carName: listItems?.carName,
            plateNumber: listItems?.plateNumber,
            color: listItems?.color,
            modelYear: listItems?.modelYear,
            comments: listItems?.comments,
          },
          attachStaffID: listItems.AttachmentJSON
            ? JSON.parse(listItems.AttachmentJSON)
                ?.filter((data: any) => data.targetName === "attachStaffID")
                ?.map((data: any) => {
                  return {
                    ...data,
                    ID: listItems.ID,
                  };
                })
            : [],
          attachCarRegistration: listItems.AttachmentJSON
            ? JSON.parse(listItems.AttachmentJSON)
                ?.filter(
                  (data: any) => data.targetName === "attachCarRegistration"
                )
                ?.map((data: any) => {
                  return {
                    ...data,
                    ID: listItems.ID,
                  };
                })
            : [],
          attachDriverID: listItems.AttachmentJSON
            ? JSON.parse(listItems.AttachmentJSON)
                ?.filter((data: any) => data.targetName === "attachDriverID")
                ?.map((data: any) => {
                  return {
                    ...data,
                    ID: listItems.ID,
                  };
                })
            : [],
        });
        console.log("Res listItems", listItems);
      });
  }

  public onSubmit = async () => {
    const { context } = this.props;
    const {
      requestorInfo,
      attachDriverID,
      attachCarRegistration,
      parkingInfo,
      vehicleInfo,
      conditionCheckBox,
      postAttachments,
      PendingWith
    } = this.state;
    const plateNumber = (number: any) => {
      const regex = /^[A-Za-z]{3}\d{4}$/;
      const isValidNumber = regex.test(number);
      console.log("isValidNumber", isValidNumber);
      return !isValidNumber;
    };

    const validityFrom = this.state.parkingInfo.validityFrom;
    const validityTo = this.state.parkingInfo.validityTo;
    if (conditionCheckBox == false) {
      alert("Please Agree the Terms and Conditions!");
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
    } else if (!vehicleInfo.carName) {
      alert("Please enter the Car Name!");
    } else if (!vehicleInfo.plateNumber) {
      alert("Please enter the Plate Number!");
    } else if (plateNumber(vehicleInfo.plateNumber)) {
      alert("Invalid Plate Number!");
    } else if (
      !vehicleInfo.modelYear ||
      vehicleInfo.modelYear?.length < 3 ||
      vehicleInfo.modelYear?.length > 30
    ) {
      alert(
        "Model Year cannot be blank, should have more than 2 characters and less than 30 characters!"
      );
    } else if (
      !vehicleInfo.color ||
      vehicleInfo.color?.length < 3 ||
      vehicleInfo.color?.length > 30
    ) {
      alert(
        "Color cannot be blank, should have more than 2 characters and less than 30 characters!"
      );
    } else if (!attachDriverID) {
      alert("Please Attach the Driver ID!");
    } else if (!attachCarRegistration) {
      alert("Please Attach the Car Registration!");
    } else {
      const headers: any = {
        "X-HTTP-Method": "POST",
        "If-Match": "*",
      };
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify({
          Title: requestorInfo.staffName,
          grade: requestorInfo.grade,
          staffId: requestorInfo.staffId,
          Gender: requestorInfo.gender,
          department: requestorInfo.Department,
          hiringDate: requestorInfo.hiringDate,
          jobCategory: requestorInfo.jobCategory,
          staffExtension: requestorInfo.staffExtension,
          mobileNumber: requestorInfo.mobileNumber,
          relatedEntity: requestorInfo.relatedEntity,
          requestType: parkingInfo.requestType,
          requestedBuilding: parkingInfo.requestedBuilding,
          parkingType: parkingInfo.parkingType,
          parkingArea: parkingInfo.parkingArea,
          validityFrom: parkingInfo.validityFrom,
          validityTo: parkingInfo.validityTo,
          carName: vehicleInfo.carName,
          plateNumber: vehicleInfo.plateNumber,
          color: vehicleInfo.color,
          RequestorNationalIdExpiryDate:
            vehicleInfo.requestorNationalIdExpiryDate,
          modelYear: vehicleInfo.modelYear,
          comments: vehicleInfo.comments,
          AttachmentJSON: JSON.stringify(this.state.attachmentJson),
          RequestorValidityTo: vehicleInfo.requestorValidityTo,
          pendingWith: PendingWith
        }),
      };
      console.log(parkingInfo.requestType, "requestType");
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('Parking-Request')/items`,
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
      // window.history.go(-1);
      // this.setState({
      //   requestorInfo: {
      //     staffName: "",
      //     grade: "",
      //     staffId: "",
      //     Gender: "",
      //     staffExtension: "",
      //     hiringDate: "",
      //     jobCategory: "",
      //     department: "",
      //     mobileNumber: "",
      //     relatedEntity: "",
      //   },
      //   parkingInfo: {
      //     requestType: "Permanent Parking",
      //     requestedBuilding: "Permanent",
      //     parkingType: "Public",
      //     parkingArea: "Public",
      //     validityFrom: "",
      //     validityTo: "",
      //   },
      //   vehicleInfo: {
      //     carName: "",
      //     plateNumber: "",
      //     color: "",
      //     modelYear: "",
      //     comments: "",
      //   },
      // });
    }
  };
  public componentDidUpdate(
    prevProps: Readonly<IParkingRequestFormProps>,
    prevState: Readonly<IParkingRequestFormState>
  ): void {
    const { staffIdProofJSON, carRegistrationJSON, driverIdProofJSON } =
      this.state;
    if (prevState.postAttachments !== this.state.postAttachments) {
      const attachmentPostJson = [
        staffIdProofJSON,
        carRegistrationJSON,
        driverIdProofJSON,
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
      ...Attachment.attachStaffID,
      ...Attachment.attachCarRegistration,
      ...Attachment.attachDriverID,
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
      .getByTitle("Parking-Request")
      .items.getById(ID)
      .attachmentFiles.addMultiple(uniqueAttachmentData);
    console.log("Attachment Post Status", postResponse);
    alert("You have successfully submitted!");
    window.history.go(-1);
  }
  public onApproveReject: (
    Type: string,
    PendingWith: string,
  
  ) => void = async (Type: string, PendingWith: string) => {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    const postUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Parking-Request')/items('${itemId}')`;
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
    if (updateInteraction) {
      alert("you have successully" + Type + "!");
      window.history.go(-1);
    }
    // if (updateInteraction) this.getBasicBlogs();
  };
  public render(): React.ReactElement<IParkingRequestFormProps> {
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
      vehicleInfo,
      parkingInfo,
      requestorInfo,
      language,
      postAttachments,
      staffIdProofJSON,
      carRegistrationJSON,
      driverIdProofJSON,
      attachDriverID,
      attachCarRegistration,
      attachStaffID,
      conditionCheckBox,
      attachmentJson,
      disable,
      PendingWith,
    } = this.state;
    const { context } = this.props;
    const handleSubmit = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      console.log("Form Data", event);
      console.log(
        "Form Submit",
        vehicleInfo,
        attachStaffID,
        attachDriverID,
        attachCarRegistration,
        parkingInfo,
        requestorInfo
      );
    };
    const handleFileChange = (event: { target: { name: any; files: any } }) => {
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
          if (targetName === "attachStaffID") {
            this.setState({
              attachStaffID: event.target.files,
              staffIdProofJSON: {
                targetName: targetName,
                fileName: fileName,
              },
            });
          } else if (targetName === "attachCarRegistration") {
            this.setState({
              attachCarRegistration: event.target.files,
              carRegistrationJSON: {
                targetName: targetName,
                fileName: fileName,
              },
            });
          } else if (targetName === "attachDriverID") {
            this.setState({
              attachDriverID: event.target.files,
              driverIdProofJSON: {
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
      staffIdProofJSON,
      carRegistrationJSON,
      driverIdProofJSON,
      attachmentJson
    );
    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Parking Request Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Parking Request Form
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
              {language === "En"
                ? "Requestor Information"
                : "معلومات مقدم الطلب"}
            </div>
            <div className="row">
              <RequestorInfo
                type="text"
                disabled={true}
                label={language === "En" ? "Staff Name" : "اسم الموظفين"}
                name="staffName"
                state={requestorInfo}
                requestorInfo={requestorInfo.staffName}
                self={this}
              />
              <RequestorInfo
                type="text"
                disabled={true}
                label={language === "En" ? "Grade" : "درجة"}
                name="grade"
                state={requestorInfo}
                requestorInfo={requestorInfo.grade}
                self={this}
              />
            </div>
            <div className="row">
              <RequestorInfo
                type="text"
                disabled={true}
                label={language === "En" ? "ID Number" : "رقم الهوية"}
                name="staffId"
                state={requestorInfo}
                requestorInfo={requestorInfo.staffId}
                self={this}
              />
              <RequestorInfo
                type="text"
                disabled={true}
                label={language === "En" ? "Gender" : "جنس"}
                name="Gender"
                state={requestorInfo}
                requestorInfo={requestorInfo.Gender}
                self={this}
              />
            </div>
            <div className="row">
              <RequestorInfo
                type="text"
                disabled={true}
                label={language === "En" ? "Staff Extension" : "تمديد الموظفين"}
                name="staffExtension"
                state={requestorInfo}
                requestorInfo={requestorInfo.staffExtension}
                self={this}
              />
              <RequestorInfo
                type="date"
                disabled={true}
                label={language === "En" ? "Hiring Date" : "تاريخ التوظيف"}
                name="hiringDate"
                state={requestorInfo}
                requestorInfo={requestorInfo.hiringDate}
                self={this}
              />
            </div>
            <div className="row">
              <RequestorInfo
                type="text"
                disabled={true}
                label={language === "En" ? "Job Category" : "فئة الوظيفة"}
                name="jobCategory"
                state={requestorInfo}
                requestorInfo={requestorInfo.jobCategory}
                self={this}
              />
              <RequestorInfo
                type="text"
                disabled={true}
                label={language === "En" ? "Department" : "قسم "}
                name="department"
                state={requestorInfo}
                requestorInfo={requestorInfo.department}
                self={this}
              />
            </div>
            <div className="row mb-4">
              <RequestorInfo
                type="text"
                disabled={true}
                label={language === "En" ? "Mobile Number " : "رقم الموبايل "}
                name="mobileNumber"
                state={requestorInfo}
                requestorInfo={requestorInfo.mobileNumber}
                self={this}
              />
              <RequestorInfo
                type="text"
                disabled={true}
                label={language === "En" ? "Related Entity" : "كيان ذو صلة"}
                name="relatedEntity"
                state={requestorInfo}
                requestorInfo={requestorInfo.relatedEntity}
                self={this}
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En"
                ? "Parking Information"
                : "معلومات وقوف السيارات"}
            </div>
            <div className="row">
              <ParkingInfo
                type="select"
                disabled={disable || parkingInfo.parkingType !== ""}
                label={
                  <>
                    {language === "En" ? "Request Type " : "نوع الطلب "}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestType"
                options={[
                  "",
                  "Permanent Entry Permission",
                  "Temporary Entry Permission",
                ]}
                state={parkingInfo}
                parkingInfo={parkingInfo.requestType}
                self={this}
              />
              <ParkingInfo
                type="select"
                disabled={disable}
                label={
                  <>
                    {language === "En" ? "Request Building " : "طلب بناء"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="requestedBuilding"
                options={["Permanent Parking", "Temporary Parking"]}
                state={parkingInfo}
                parkingInfo={parkingInfo.requestedBuilding}
                self={this}
              />
            </div>
            <div className="row">
              <ParkingInfo
                type="select"
                disabled={disable || parkingInfo.requestType !== ""}
                label={
                  <>
                    {language === "En" ? "Parking Type" : "نوع موقف السيارات"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="parkingType"
                options={["","Public", "Reserved"]}
                state={parkingInfo}
                parkingInfo={parkingInfo.parkingType}
                self={this}
              />
              <ParkingInfo
                type="select"
                disabled={disable}
                label={
                  <>
                    {language === "En" ? "Parking Area" : "منطقة وقوف السيارات"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="parkingArea"
                options={["Public", "Reserved"]}
                state={parkingInfo}
                parkingInfo={parkingInfo.parkingArea}
                self={this}
              />
            </div>
            <div className="row mb-4">
              <ParkingInfo
                type="date"
                disabled={disable}
                label={
                  <>
                    {language === "En" ? "Validity From" : "الصلاحية من"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="validityFrom"
                state={parkingInfo}
                parkingInfo={parkingInfo.validityFrom}
                self={this}
              />
              <ParkingInfo
                type="date"
                disabled={disable}
                label={
                  <>
                    {language === "En" ? "Validity To" : "الصلاحية إلى"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="validityTo"
                state={parkingInfo}
                parkingInfo={parkingInfo.validityTo}
                self={this}
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En" ? "Vehicle Information" : "معلومات السيارة"}
            </div>
            <div className="row">
              <VehicleInfo
                type="text"
                disabled={disable}
                label={
                  <>
                    {language === "En" ? "Car Name" : "اسم السيارة"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="carName"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.carName}
                self={this}
              />
              <VehicleInfo
                type="text"
                disabled={disable}
                label={
                  <>
                    {language === "En" ? "Plate Number" : "رقم اللوحة"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="plateNumber"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.plateNumber}
                self={this}
              />
            </div>
            <div className="row">
              <VehicleInfo
                type="text"
                disabled={disable}
                label={
                  <>
                    {language === "En" ? "Color" : "لون"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="color"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.color}
                self={this}
              />
              <VehicleInfo
                type="text"
                disabled={disable}
                label={
                  <>
                    {language === "En" ? "Model Year" : "سنة الموديل"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="modelYear"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.modelYear}
                self={this}
              />
            </div>
            <div className="row">
              <VehicleInfo
                type="file"
                disabled={disable}
                label={
                  language === "En" ? "Attach Staff ID" : "إرفاق هوية الموظف"
                }
                name="attachStaffID"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.attachStaffID}
                self={this}
                fileData={attachStaffID}
                handleFileChange={handleFileChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {attachStaffID?.length > 0 && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {attachStaffID[0]?.name || attachStaffID[0]?.fileName}
                    </span>
                    <span
                      className="px-3 py-2 bg-danger text-white fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ attachStaffID: "" });
                      }}
                    >
                      X
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <VehicleInfo
                disabled={disable}
                type="file"
                label={
                  <>
                    {language === "En"
                      ? "Attach Car Registration"
                      : "إرفاق تسجيل السيارة"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="attachCarRegistration"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.attachCarRegistration}
                self={this}
                fileData={attachCarRegistration}
                handleFileChange={handleFileChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {attachCarRegistration?.length > 0 && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {attachCarRegistration[0]?.name ||
                        attachCarRegistration[0]?.fileName}
                    </span>
                    <span
                      className="px-3 py-2 bg-danger text-white fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ attachCarRegistration: "" });
                      }}
                    >
                      X
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <VehicleInfo
                disabled={disable}
                type="file"
                label={
                  <>
                    {language === "En"
                      ? "Attach Driver ID"
                      : "إرفاق معرف السائق"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="attachDriverID"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.attachDriverID}
                self={this}
                fileData={attachDriverID}
                handleFileChange={handleFileChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {attachDriverID?.length > 0 && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {attachDriverID[0]?.name || attachDriverID[0]?.fileName}
                    </span>
                    <span
                      className="px-3 py-2 bg-danger text-white fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ attachDriverID: "" });
                      }}
                    >
                      X
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <VehicleInfo
                disabled={disable}
                type="textArea"
                label={language === "En" ? "Comments" : "التعليقات"}
                name="comments"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.comments}
                self={this}
              />
            </div>
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
            { disable == false && (
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
            {PendingWith == "SSIMS Reviewer" && disable == true &&(
               <div className="d-flex justify-content-end mb-2 gap-3">
               <button
                 className="px-4 py-2 text-white"
                 style={{ backgroundColor: "#223771" }}
                 type="button"
                 onClick={() => {
                  if (PendingWith === "SSIMS Reviewer") {
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

                   if (PendingWith === "SSIMS Reviewer") {
                     this.onApproveReject(
                       "Reject",
                       "Rejected by SSIMS Reviewer",
                       
                     );
                  
                   }
                 }}
               >
                 {language === "En" ? "Reject" : "أرشيف"}
               </button>
               
             </div>
            )}
             {PendingWith == "SSIMS Reviewer" && disable == true && parkingInfo.parkingType && (
              <button
                 className="px-4 py-2 text-white"
                 style={{ backgroundColor: "#223771" }}
                 type="button"
                 onClick={() => {

                   if (PendingWith === "SSIMS Reviewer") {
                     this.onApproveReject(
                       "Add to waiting list",
                       "Added to waiting list",
                       
                     );
                  
                   }
                 }}
               >
                 {language === "En" ? "Add To Waiting List" : "أرشيف"}
               </button>
             )}
          </form>
        </div>
      </CommunityLayout>
    );
  }
}
