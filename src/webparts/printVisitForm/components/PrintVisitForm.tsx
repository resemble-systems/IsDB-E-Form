import * as React from "react";
// import styles from "./PrintVisitForm.module.scss";
import type { IPrintVisitFormProps } from "./IPrintVisitFormProps";
// import { escape } from '@microsoft/sp-lodash-subset';
import InputFeild from "./InputFeild";
import "./index.css";
// import { Select } from "antd";
import CommunityLayout from "../../../common-components/communityLayout";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient,SPHttpClientResponse } from "@microsoft/sp-http";
// import { MSGraphClientV3 } from "@microsoft/sp-http";

interface IPrintVisitFormState {
  inputFeild: any;
  requestorIdProof: any;
  requestorPhoto: any;
  requestorContract: any;
  visitorPhoto: any;
}

export default class PrintVisitForm extends React.Component<
  IPrintVisitFormProps,
  IPrintVisitFormState
> {
  public constructor(props: IPrintVisitFormProps, state: IPrintVisitFormState) {
    super(props);
    this.state = {
      inputFeild: {
        staffName: "",
        grade: "",
        staffId: "",
        Department: "",
        phoneExtension: "",
      },
      requestorIdProof: "",
      requestorPhoto: "",
      requestorContract: "",
      visitorPhoto: "",
    };
  }
  public componentDidMount() {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    
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

  public render(): React.ReactElement<IPrintVisitFormProps> {
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
      visitorPhoto,
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
            {/* {filledBy === "Receptionist Task View" ? (
          <> Visit Request ({filledBy})</>
        ) : (
          <> Trainee/Contract Form ({filledBy})</>
        )} */}
            Print Visit
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
                label="Visit ID"
                name="visitId"
                state={inputFeild}
                inputFeild={inputFeild.visitId}
              />
              <InputFeild
                type="date"
                label="Visit Date"
                name="visitDate"
                state={inputFeild}
                inputFeild={inputFeild.visitDate}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                label="Name"
                name="visitorName"
                state={inputFeild}
                inputFeild={inputFeild.visitorName}
                self={this}
              />
              <InputFeild
                type="text"
                label="Visited Dept"
                name="visitedDept"
                state={inputFeild}
                inputFeild={inputFeild.visitedDept}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                label="Visiting Employee"
                name="visitingEmployee"
                state={inputFeild}
                inputFeild={inputFeild.visitingEmployee}
                self={this}
              />
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
