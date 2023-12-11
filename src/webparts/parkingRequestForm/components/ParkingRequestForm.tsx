import * as React from "react";
import type { IParkingRequestFormProps } from "./IParkingRequestFormProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import "./index.css";
import { Select } from "antd";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import RequestorInfo from "./inputComponents/RequestInfo";
import VehicleInfo from "./inputComponents/VehicleInfo";
import ParkingInfo from "./inputComponents/ParkingInfo";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Web } from "sp-pnp-js";

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
  requestorIdProofJSON: any;
  requestorPhotoJSON: any;
  requestorContractJSON: any;
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
      requestorIdProofJSON: {},
      requestorPhotoJSON: {},
      requestorContractJSON: {},
    };
  }

  public componentDidMount() {
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
  public onSubmit = async () => {
    const { context } = this.props;
    const { requestorInfo, parkingInfo, vehicleInfo } = this.state;
    const headers: any = {
      "X-HTTP-Method": "POST",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Title: requestorInfo.staffName,
        Grade: requestorInfo.grade,
        Staff_id: requestorInfo.staffId,
        Gender: requestorInfo.gender,
        Department: requestorInfo.Department,
        HiringDate: requestorInfo.hiringDate,
        JobCategory: requestorInfo.jobCategory,
        StaffExtension: requestorInfo.staffExtension,
        Mobilenumber: requestorInfo.mobileNumber,
        RelatedEntity: requestorInfo.relatedEntity,
        RequestType: parkingInfo.requestType,
        RequestedBuilding: parkingInfo.requestedBuilding,
        ParkingType: parkingInfo.parkingType,
        ParkingArea: parkingInfo.parkingArea,
        ValidityFrom: parkingInfo.validityFrom,
        ValidityTo: parkingInfo.validityTo,
        CarName: vehicleInfo.carName,
        PlateNumber: vehicleInfo.plateNumber,
        Color: vehicleInfo.color,
        RequestorNationalIdExpiryDate:
          vehicleInfo.requestorNationalIdExpiryDate,
        ModelYear: vehicleInfo.modelYear,
        AttachStaffID: vehicleInfo.attachStaffID,
        AttachCarRegistration: vehicleInfo.attachCarRegistration,
        AttachDriverID: vehicleInfo.attachDriverID,
        Comments: vehicleInfo.comments,
        RequestorValidityTo: vehicleInfo.requestorValidityTo,
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
    } else {
      alert("visitor form Failed.");
      console.log("Post Failed", postResponse);
    }
    window.history.go(-1);
    this.setState({
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
      attachStaffID: "",
      attachCarRegistration: "",
      attachDriverID: "",
    });
  };
  public componentDidUpdate(
    prevProps: Readonly<IParkingRequestFormProps>,
    prevState: Readonly<IParkingRequestFormState>
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
  }
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
      requestorContractJSON,
      requestorIdProofJSON,
      requestorPhotoJSON,
      attachDriverID,
      attachCarRegistration,
      attachStaffID,

      attachmentJson,
    } = this.state;
    const { context, self } = this.props;
    const handleSubmit = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      console.log("Form Data", event);
      console.log("Form Submit", vehicleInfo, parkingInfo, requestorInfo);
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
          if (targetName === "attachStaffID") {
            this.setState({
              attachStaffID: event.target.files,
              requestorIdProofJSON: {
                targetName: targetName,
                fileName: fileName,
              },
            });
          } else if (targetName === "attachCarRegistration") {
            this.setState({
              attachCarRegistration: event.target.files,
              requestorPhotoJSON: {
                targetName: targetName,
                fileName: fileName,
              },
            });
          } else if (targetName === "attachDriverID") {
            this.setState({
              attachDriverID: event.target.files,
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
              Requestor Information
            </div>
            <div className="row">
              <RequestorInfo
                type="text"
                label={language === "En" ? "Staff Name" : "اسم الموظفين"}
                name="staffName"
                state={requestorInfo}
                requestorInfo={requestorInfo.staffName}
                self={this}
              />
              <RequestorInfo
                type="text"
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
                label={language === "En" ? "ID Number" : "رقم الهوية"}
                name="staffId"
                state={requestorInfo}
                requestorInfo={requestorInfo.staffId}
                self={this}
              />
              <RequestorInfo
                type="text"
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
                label={language === "En" ? "Staff Extension" : "تمديد الموظفين"}
                name="staffExtension"
                state={requestorInfo}
                requestorInfo={requestorInfo.staffExtension}
                self={this}
              />
              <RequestorInfo
                type="date"
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
                label={language === "En" ? "Job Category" : "فئة الوظيفة"}
                name="jobCategory"
                state={requestorInfo}
                requestorInfo={requestorInfo.jobCategory}
                self={this}
              />
              <RequestorInfo
                type="text"
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
                label={language === "En" ? "Mobile Number " : "رقم الموبايل "}
                name="mobileNumber"
                state={requestorInfo}
                requestorInfo={requestorInfo.mobileNumber}
                self={this}
              />
              <RequestorInfo
                type="text"
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
              Parking Information
            </div>
            <div className="row">
              <ParkingInfo
                label={language === "En" ? "Request Type " : "نوع الطلب "}
                name="requestType"
                options={[
                  "Permanent Entry Permission",
                  "Temporary Entry Permission",
                ]}
                state={parkingInfo}
                parkingInfo={parkingInfo.requestType}
                self={this}
              />
              <ParkingInfo
                label={language === "En" ? "Request Building " : "طلب بناء"}
                name="requestedBuilding"
                options={["Permanent Parking", "Temporary Parking"]}
                state={parkingInfo}
                parkingInfo={parkingInfo.requestedBuilding}
                self={this}
              />
            </div>
            <div className="row">
              <ParkingInfo
                label={language === "En" ? "Parking Type" : "نوع موقف السيارات"}
                name="parkingType"
                options={["Public", "Reserved"]}
                state={parkingInfo}
                parkingInfo={parkingInfo.parkingType}
                self={this}
              />
              <ParkingInfo
                label={
                  language === "En" ? "Parking Area" : "منطقة وقوف السيارات"
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
                label={language === "En" ? "Validity From" : "الصلاحية من"}
                name="validityFrom"
                options={[
                  "Permanent Entry Permis..",
                  "Temporary Entry Permission",
                  "Permanent Parking",
                  "Temporary Parking",
                ]}
                state={parkingInfo}
                parkingInfo={parkingInfo.validityFrom}
                self={this}
              />
              <ParkingInfo
                type="date"
                label={language === "En" ? "Validity To" : "الصلاحية إلى"}
                name="validityTo"
                options={[
                  "Permanent Entry Permis..",
                  "Temporary Entry Permission",
                  "Permanent Parking",
                  "Temporary Parking",
                ]}
                state={parkingInfo}
                parkingInfo={parkingInfo.validityTo}
                self={this}
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              Vehicle Information
            </div>
            <div className="row">
              <VehicleInfo
                type="text"
                label={language === "En" ? "Car Name" : "اسم السيارة"}
                name="carName"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.carName}
                self={this}
              />
              <VehicleInfo
                type="text"
                label={language === "En" ? "Plate Number" : "رقم اللوحة"}
                name="plateNumber"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.plateNumber}
                self={this}
              />
            </div>
            <div className="row">
              <VehicleInfo
                type="text"
                label={language === "En" ? "Color" : "لون"}
                name="color"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.color}
                self={this}
              />
              <VehicleInfo
                type="text"
                label={language === "En" ? "Model Year" : "سنة الموديل"}
                name="modelYear"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.modelYear}
                self={this}
              />
            </div>
            <div className="row">
              <VehicleInfo
                type="text"
                label={
                  language === "En" ? "Attach Staff ID" : "إرفاق هوية الموظف"
                }
                name="attachStaffID"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.attachStaffID}
                self={this}
                handleFileChange={handleChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {attachStaffID && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {attachStaffID[0]?.name}
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
                type="text"
                label={
                  language === "En"
                    ? "Attach Car Registration"
                    : "إرفاق تسجيل السيارة"
                }
                name="attachCarRegistration"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.attachCarRegistration}
                self={this}
                handleFileChange={handleChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {attachCarRegistration && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {attachCarRegistration[0]?.name}
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
                type="text"
                label={
                  language === "En" ? "Attach Driver ID" : "إرفاق معرف السائق"
                }
                name="attachDriverID"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.attachDriverID}
                self={this}
                handleFileChange={handleChange}
              />{" "}
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {attachDriverID && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {attachDriverID[0]?.name}
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
                type="textArea"
                label={language === "En" ? "Comments" : "التعليقات"}
                name="comments"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.comments}
                self={this}
              />
            </div>
            <div className="d-flex justify-content-start py-2 mb-4">
              <input type="checkbox" />
              <label className="ps-2">
                <a href="#">I agree to Terms & Conditions</a>
              </label>
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </CommunityLayout>
    );
  }
}
