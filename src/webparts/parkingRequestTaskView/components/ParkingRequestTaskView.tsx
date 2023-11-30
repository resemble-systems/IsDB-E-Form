
import * as React from "react";
// import styles from './ParkingRequestForm.module.scss';
import type { IParkingRequestTaskViewProps } from "./IParkingRequestTaskViewProps";
// import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
import "./index.css";
import RequestorInfo from "./inputComponents/RequestInfo";
import VehicleInfo from "./inputComponents/VehicleInfo";
import ParkingInfo from "./inputComponents/ParkingInfo";
import CommunityLayout from "../../../common-components/communityLayout/index";

interface IParkingRequestTaskViewState {
  requestorInfo: any;
  parkingInfo: any;
  vehicleInfo: any;
}

export default class ParkingRequestTaskView extends React.Component<
IParkingRequestTaskViewProps,
IParkingRequestTaskViewState
> {
  public constructor(
    props: IParkingRequestTaskViewProps,
    state: IParkingRequestTaskViewState
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
        requestType: "",
        requestedBuilding: "",
        parkingType: "",
        parkingArea: "",
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
    };
  }

  public render(): React.ReactElement<IParkingRequestTaskViewProps> {
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

    const { vehicleInfo, parkingInfo, requestorInfo } = this.state;
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
            Please fill out the feilds in * to proceed
          </div>
          <div className="d-flex justify-content-end mb-2">
            <select className="form-select" style={{ width: "max-content" }}>
              <option selected>Select Language</option>
              <option value="1">English</option>
              <option value="2">Arabic</option>
            </select>
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
                label="Staff Name"
                name="staffName"
                state={requestorInfo}
                requestorInfo={requestorInfo.staffName}
                self={this}
              />
              <RequestorInfo
                type="text"
                label="Grade"
                name="grade"
                state={requestorInfo}
                requestorInfo={requestorInfo.grade}
                self={this}
              />
            </div>
            <div className="row">
              <RequestorInfo
                type="text"
                label="Staff ID"
                name="staffId"
                state={requestorInfo}
                requestorInfo={requestorInfo.staffId}
                self={this}
              />
              <RequestorInfo
                type="text"
                label="Gender"
                name="Gender"
                state={requestorInfo}
                requestorInfo={requestorInfo.Gender}
                self={this}
              />
            </div>
            <div className="row">
              <RequestorInfo
                type="text"
                label="Staff Extension"
                name="staffExtension"
                state={requestorInfo}
                requestorInfo={requestorInfo.staffExtension}
                self={this}
              />
              <RequestorInfo
                type="date"
                label="Hiring Date"
                name="hiringDate"
                state={requestorInfo}
                requestorInfo={requestorInfo.hiringDate}
                self={this}
              />
            </div>
            <div className="row">
              <RequestorInfo
                type="text"
                label="Job Category"
                name="jobCategory"
                state={requestorInfo}
                requestorInfo={requestorInfo.jobCategory}
                self={this}
              />
              <RequestorInfo
                type="text"
                label="Department"
                name="department"
                state={requestorInfo}
                requestorInfo={requestorInfo.department}
                self={this}
              />
            </div>
            <div className="row mb-4">
              <RequestorInfo
                type="text"
                label="Mobile Number"
                name="mobileNumber"
                state={requestorInfo}
                requestorInfo={requestorInfo.mobileNumber}
                self={this}
              />
              <RequestorInfo
                type="text"
                label="Related Entity"
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
                label="Request Type"
                name="requestType"
                options={[
                  "Permanent Entry Permis..",
                  "Temporary Entry Permission",
                  "Permanent Parking",
                  "Temporary Parking",
                ]}
                state={parkingInfo}
                parkingInfo={parkingInfo.requestType}
                self={this}
              />
              <ParkingInfo
                label="Requested Building"
                name="requestedBuilding"
                options={[
                  "Permanent Entry Permis..",
                  "Temporary Entry Permission",
                  "Permanent Parking",
                  "Temporary Parking",
                ]}
                state={parkingInfo}
                parkingInfo={parkingInfo.requestedBuilding}
                self={this}
              />
            </div>
            <div className="row">
              <ParkingInfo
                label="Parking Type"
                name="parkingType"
                options={[
                  "Permanent Entry Permis..",
                  "Temporary Entry Permission",
                  "Permanent Parking",
                  "Temporary Parking",
                ]}
                state={parkingInfo}
                parkingInfo={parkingInfo.parkingType}
                self={this}
              />
              <ParkingInfo
                label="Parking Area"
                name="parkingArea"
                options={[
                  "Permanent Entry Permis..",
                  "Temporary Entry Permission",
                  "Permanent Parking",
                  "Temporary Parking",
                ]}
                state={parkingInfo}
                parkingInfo={parkingInfo.parkingArea}
                self={this}
              />
            </div>
            <div className="row mb-4">
              <ParkingInfo
                type="date"
                label="Validity From"
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
                label="Validity To"
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
                label="Car Name"
                name="carName"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.carName}
                self={this}
              />
              <VehicleInfo
                type="text"
                label="Plate Number"
                name="plateNumber"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.plateNumber}
                self={this}
              />
            </div>
            <div className="row">
              <VehicleInfo
                type="text"
                label="Color"
                name="color"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.color}
                self={this}
              />
              <VehicleInfo
                type="text"
                label="Model Year"
                name="modelYear"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.modelYear}
                self={this}
              />
            </div>
            <div className="row">
              <VehicleInfo
                type="text"
                label="Attach Staff ID"
                name="attachStaffID"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.attachStaffID}
                self={this}
              />
            </div>
            <div className="row">
              <VehicleInfo
                type="text"
                label="Attach Car Registration"
                name="attachCarRegistration"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.attachCarRegistration}
                self={this}
              />
            </div>
            <div className="row">
              <VehicleInfo
                type="text"
                label="Attach Driver ID"
                name="attachDriverID"
                state={vehicleInfo}
                vehicleInfo={vehicleInfo.attachDriverID}
                self={this}
              />
            </div>
            <div className="row">
              <VehicleInfo
                type="textArea"
                label="Comments"
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
