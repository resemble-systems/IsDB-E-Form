import * as React from "react";
// import styles from './ParkingRequestForm.module.sass';
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
  // SPHttpClientResponse,
} from "@microsoft/sp-http";
import CommunityLayout from "../../../common-components/communityLayout/index";

interface IParkingRequestFormState {
  requestorInfo: any;
  parkingInfo: any;
  vehicleInfo: any;
  language: any;
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
        attachStaffID: "",
        attachCarRegistration: "",
        attachDriverID: "",
        comments: "",
      },
      language: "En",
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
          )

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
    const {requestorInfo, parkingInfo,vehicleInfo } = this.state;
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
        JobCategory:  requestorInfo.jobCategory,
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
        RequestorNationalIdExpiryDate: vehicleInfo.requestorNationalIdExpiryDate,
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
      // setTimeout(() => {
      //   console.log("visitor request form success");
      // }, 1000);
    } else {
      alert("visitor form Failed.");
      console.log("Post Failed", postResponse);
    }
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
        attachStaffID: "",
        attachCarRegistration: "",
        attachDriverID: "",
        comments: "",
      },
    })
    
  }
  public render(): React.ReactElement<IParkingRequestFormProps> {
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

    const { vehicleInfo, parkingInfo, requestorInfo, language } = this.state;
    const { context, self } = this.props;
    const handleSubmit = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      console.log("Form Data", event);
      console.log("Form Submit", vehicleInfo, parkingInfo, requestorInfo);
    };

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
              // className={`border border-2 ${styles.announcementsFilterInput}`}
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
                options={[ "Permanent Parking",
                "Temporary Parking",]}
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
              />
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
              />
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
              />
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
