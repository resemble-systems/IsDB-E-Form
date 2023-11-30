import * as React from 'react';
// import styles from './VisitRequestBlockListView.module.scss';
import type { IVisitRequestCheckOutProps } from './IVisitRequestCheckOutProps';
import CommunityLayout from "../../../common-components/communityLayout/index";

// import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
import InputFeild from './InputFeild';
import {
  SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
// import { MSGraphClientV3 } from "@microsoft/sp-http";

interface IVisitRequestCheckOutState {
  inputFeild: any;
  visitorIdProof: any;
  visitorPhoto: any;
}

export default class VisitRequestBlockListView extends React.Component<
IVisitRequestCheckOutProps,
  IVisitRequestCheckOutState
> {
  public constructor(props: IVisitRequestCheckOutProps, state: IVisitRequestCheckOutState) {
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
    };
  }
  public componentDidMount() {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    // this.getDetails();
    // this.getVisitRequest();
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
    // const { inputFeild } = this.state;
    // if (inputFeild.visitorName.length < 3 || inputFeild.visitorName.length > 30) {
    //   alert("Visitor Name cannot be blank, should have more than 2 characters and less than 30 characters!");
    // } else if (inputFeild.mobileNumber.length < 10 || inputFeild.mobileNumber.length > 15 ) {
    //   alert(
    //     "Mobile Number should not be blank, should have more than 10 characters and less than 15 characters!"
    //   );
    // } else if (inputFeild.visitorOrgType.length < 3 || inputFeild.visitorOrgType.length > 30 ) {
    //   alert(
    //     "Visitor Organization Type should not be blank, should have more than 3 characters and less than 30 characters!"
    //   );
    // } else if (inputFeild.visitorRelatedOrg.length < 3 || inputFeild.visitorRelatedOrg.length > 30 ) {
    //   alert(
    //     "Visitor Related Organization should not be blank, should have more than 3 characters and less than 30 characters!"
    //   );
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
      "Content-Type": "application/json;odata=nometadata",
    };

    const spHttpClintOptions: ISPHttpClientOptions =
      window.location.href.indexOf("?itemID") != -1
      ?
         { headers,
        body: JSON.stringify({
          Checkout: "true",
          CheckoutDate: new Date().toString()
         
        }),
          }
          :
          { headers,
            body: JSON.stringify({
              Checkout: "true",
              CheckoutDate: new Date().toString()
             
            }),
              }
    
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
                  // this.postSubId();
        
                  // alert("You have successfully submitted to this Blogs!");
                  window.history.go(-1);
                  this.setState(
                    {
                     
                    },
    )});
  
  };
  public render(): React.ReactElement<IVisitRequestCheckOutProps> {
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
    const { inputFeild, visitorIdProof, visitorPhoto } = this.state;
    const { context, self,  } = this.props;
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
          
        Visitor Request Form(At Checkout)
        </div>
        <div
          className="d-flex justify-content-center text-danger py-2 mb-4 headerText"
          style={{ backgroundColor: "#C8CDDB" }}
        >
          Please fill out the fields in * to proceed
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
              label="Office Location"
              name="officeLocation"
              state={inputFeild}
              inputFeild={inputFeild.officeLocation}
              self={this}
            />
            <InputFeild
              type="text"
              label="Office Number"
              name="officeNumber"
              state={inputFeild}
              inputFeild={inputFeild.officeNumber}
              self={this}
            />
          </div>
          <div className="row">
            <InputFeild
              type="text"
              label="Mobile Number"
              name="mobileNumber"
              state={inputFeild}
              inputFeild={inputFeild.mobileNumber}
              self={this}
            />
            <InputFeild
              type="text"
              label="Immediate Supervisor"
              name="immediateSupervisor"
              state={inputFeild}
              inputFeild={inputFeild.immediateSupervisor}
              self={this}
            />
          </div>
          <div className="row mb-4">
            <InputFeild
              type="text"
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
              label="Visited Employee Name"
              name="visitedEmployeeName"
              state={inputFeild}
              inputFeild={inputFeild.visitedEmployeeName}
              self={this}
            />
            <InputFeild
              type="text"
              label="Visited Employee ID"
              name="visitedEmployeeID"
              state={inputFeild}
              inputFeild={inputFeild.visitedEmployeeID}
              self={this}
            />
          </div>
          <div className="row">
            <InputFeild
              type="text"
              label="Visited Employee Entity"
              name="visitedEmployeeEntity"
              state={inputFeild}
              inputFeild={inputFeild.visitedEmployeeEntity}
              self={this}
            />
            <InputFeild
              type="text"
              label="Visited Employee Phone"
              name="visitedEmployeePhone"
              state={inputFeild}
              inputFeild={inputFeild.visitedEmployeePhone}
              self={this}
            />
          </div>
          <div className="row mb-4">
            <InputFeild
              type="text"
              label="Grade"
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
              type="text"
              label="Visitor Name"
              name="visitorName"
              state={inputFeild}
              inputFeild={inputFeild.visitorName}
            />
            <InputFeild
              self={this}
              type="text"
              label="Mobile Number"
              name="visitorMobileNumber"
              state={inputFeild}
              inputFeild={inputFeild.visitorMobileNumber}
            />
          </div>
          <div className="row">
            <InputFeild
              self={this}
              type="text"
              label="Email ID"
              name="visitorEmailId"
              state={inputFeild}
              inputFeild={inputFeild.visitorEmailId}
            />
            <InputFeild
              type="select"
              label="Nationality"
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
              label="Organization Type"
              name="visitorOrgType"
              options={["India", "UAE", "Dubai", "Saudi"]}
              state={inputFeild}
              inputFeild={inputFeild.visitorOrgType}
              self={this}
            />
            <InputFeild
              type="select"
              label="Related Org/Company"
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
              label="Purpose of Visit"
              name="visitorPurposeOfVisit"
              options={["India", "UAE", "Dubai", "Saudi"]}
              state={inputFeild}
              inputFeild={inputFeild.visitorPurposeOfVisit}
              self={this}
            />
            <InputFeild
              type="date"
              label="Anticipated Visit Time"
              name="visitorVisitTime"
              state={inputFeild}
              inputFeild={inputFeild.visitorVisitTime}
              self={this}
            />
          </div>
          <div className="row">
            <InputFeild
              type="file"
              label="Attach ID Proof"
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
              label="Attach Visitor Photograph"
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
              label="Notify the requestor by SMS"
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
              name="visitorRemarks"
              state={inputFeild}
              inputFeild={inputFeild.visitorRemarks}
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
                Checkout
              </button>
            {/* )} */}
          </div>
        </form>
      </div>
    </CommunityLayout> 
    );
  }
}

