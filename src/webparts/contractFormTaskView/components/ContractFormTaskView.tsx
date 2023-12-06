import * as React from 'react';
// import styles from './ContractForm.module.sass';
import type { IContractFormTaskViewProps } from './IContractFormTaskViewProps';
import InputFeild from './InputFeild';
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
// import { MSGraphClientV3 } from "@microsoft/sp-http";
// import { Select } from "antd";
// import "./index.css";
// import {
//   SPHttpClient,
//   ISPHttpClientOptions,
//   // SPHttpClientResponse,
// } from "@microsoft/sp-http";

interface IContractFormTaskViewState {
  inputFeild: any;
  requestorIdProof: any;
  requestorPhoto: any;
  requestorContract: any;
  // language: any;
}

export default class ContractForm extends React.Component<
IContractFormTaskViewProps,
  IContractFormTaskViewState
  
> {
  public constructor(props: IContractFormTaskViewProps, state: IContractFormTaskViewState) {
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
    };
  }
  public render(): React.ReactElement<IContractFormTaskViewProps> {
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
    const { inputFeild, requestorContract, requestorIdProof, requestorPhoto } =
      this.state;
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
           
           Trainee/Contract Form (Task View)
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
              <InputFeild
                self={this}
                type="text"
                label="Staff Name"
                name="staffName"
                state={inputFeild}
                inputFeild={inputFeild.staffName}
              />
              <InputFeild
                type="text"
                label="Grade"
                name="grade"
                state={inputFeild}
                inputFeild={inputFeild.grade}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                label="ID Number"
                name="staffId"
                state={inputFeild}
                inputFeild={inputFeild.staffId}
                self={this}
              />
              <InputFeild
                type="text"
                label="Department"
                name="Department"
                state={inputFeild}
                inputFeild={inputFeild.Department}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                label="Phone Extension"
                name="phoneExtension"
                state={inputFeild}
                inputFeild={inputFeild.phoneExtension}
                self={this}
              />
              <InputFeild
                type="text"
                label="Mobile Number"
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
                label="Request Type"
                name="requestType"
                options={["Trainee", "Option 2", "Option 3", "Option 4"]}
                state={inputFeild}
                inputFeild={inputFeild.requestType}
                self={this}
              />
              <InputFeild
                type="select"
                label="ID Type"
                name="idType"
                options={["New", "Option 2", "Option 3", "Option 4"]}
                state={inputFeild}
                inputFeild={inputFeild.idType}
                self={this}
              />
            </div>
            <div className="row mb-4">
              <InputFeild
                type="text"
                label="ID Number"
                name="idNumber"
                state={inputFeild}
                inputFeild={inputFeild.idNumber}
                self={this}
              />
              <InputFeild
                type="text"
                label="Contract Company"
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
                label="Name"
                name="requestorName"
                state={inputFeild}
                inputFeild={inputFeild.requestorName}
                self={this}
              />
              <InputFeild
                type="text"
                label="Mobile Number"
                name="requestorMobileNo"
                state={inputFeild}
                inputFeild={inputFeild.requestorMobileNo}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="select"
                label="Nationality"
                name="requestorNationality"
                options={["India", "UAE", "Dubai", "Saudi"]}
                state={inputFeild}
                inputFeild={inputFeild.requestorNationality}
                self={this}
              />
              <InputFeild
                type="text"
                label="Purpose of Contract"
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
                label="National ID"
                name="requestorNationalId"
                state={inputFeild}
                inputFeild={inputFeild.requestorNationalId}
              />
              <InputFeild
                self={this}
                type="date"
                label="National ID Expiry date"
                name="requestorNationalIdExpiryDate"
                state={inputFeild}
                inputFeild={inputFeild.requestorNationalIdExpiryDate}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label="Job Tittle"
                name="requestorJobTittle"
                state={inputFeild}
                inputFeild={inputFeild.requestorJobTittle}
              />
              <InputFeild
                self={this}
                type="text"
                label="Location of work"
                name="requestorLocationOfWork"
                state={inputFeild}
                inputFeild={inputFeild.requestorLocationOfWork}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label="Related Edu. Org."
                name="requestorRelatedEdu"
                state={inputFeild}
                inputFeild={inputFeild.requestorRelatedEdu}
              />
              <InputFeild
                self={this}
                type="text"
                label="Related Dept."
                name="requestorRelatedDept"
                state={inputFeild}
                inputFeild={inputFeild.requestorRelatedDept}
              />
            </div>
            <div className="row">
              <InputFeild
                type="date"
                label="Validity From"
                name="requestorValidityFrom"
                state={inputFeild}
                inputFeild={inputFeild.requestorValidityFrom}
                self={this}
              />
              <InputFeild
                type="date"
                label="Validity To"
                name="requestorValidityTo"
                state={inputFeild}
                inputFeild={inputFeild.requestorValidityTo}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="file"
                label="Attach ID Proof"
                name="requestorIdProof"
                self={this}
                state={requestorIdProof}
                fileData={requestorIdProof}
                handleFileChange={(event: any) => {
                  this.setState({
                    requestorIdProof: event.target.files,
                  });
                }}
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
                label="Attach Photograph"
                name="requestorPhoto"
                state={requestorPhoto}
                fileData={requestorPhoto}
                self={this}
                handleFileChange={(event: any) => {
                  this.setState({
                    requestorPhoto: event.target.files,
                  });
                }}
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
                label="Attach Contract / Letter"
                name="requestorContract"
                self={this}
                state={requestorContract}
                fileData={requestorContract}
                handleFileChange={(event: any) => {
                  this.setState({
                    requestorContract: event.target.files,
                  });
                }}
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
                label="SMS Reminder one week before expiry"
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
                label="Remarks"
                name="requestorRemarks"
                state={inputFeild}
                inputFeild={inputFeild.requestorRemarks}
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
