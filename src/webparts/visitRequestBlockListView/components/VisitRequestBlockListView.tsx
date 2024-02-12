import * as React from "react";
import type { IVisitRequestBlockListViewProps } from "./IVisitRequestBlockListViewProps";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { SPComponentLoader } from "@microsoft/sp-loader";
import InputFeild from "./InputFeild";
import {
  SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { Select } from "antd";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Web } from "sp-pnp-js";
import "./index.css";

interface IVisitRequestBlockListViewState {
  inputFeild: any;
  visitorIdProof: any;
  visitorPhoto: any;
  consecutive: any;
  sheduledTime: any;
  language: any;
  Category: any;
  checkBox: any;
  nameSelected: any;
  postAttachments: any;
  attachmentJson: any;
  visitorIdProofJSON: any;
  visitorPhotoJSON: any;
  nameOptions: any;
  autoComplete: any;
  peopleData: any;
  people: any;
  visitedEmployeeEmailID: any;
}

export default class VisitRequestBlockListView extends React.Component<
  IVisitRequestBlockListViewProps,
  IVisitRequestBlockListViewState
> {
  public constructor(
    props: IVisitRequestBlockListViewProps,
    state: IVisitRequestBlockListViewState
  ) {
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
        visitorNationality: "India",
        visitorOrgType: "",
        visitorRelatedOrg: "",
        visitorPurposeOfVisit: "BuisnessVisit",
        visitorVisitTime: "",
        visitorNotify: "",
        visitorRemarks: "",
      },
      visitorIdProof: "",
      visitorPhoto: "",
      consecutive: false,
      sheduledTime: false,
      language: "En",
      postAttachments: [],
      attachmentJson: [],
      visitorIdProofJSON: {},
      visitorPhotoJSON: {},
      Category: "English",
      checkBox: false,
      nameSelected: "",
      nameOptions: [],
      autoComplete: "off",
      peopleData: [],
      people: [],
      visitedEmployeeEmailID: "",
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
          `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('BlackList')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
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
              visitorVisitTime: new Date(listItems?.Visitorvisithour),
              visitorNotify: listItems?.Visitornotify,
              visitorRemarks: listItems?.Visitorremarks,
            },
            visitorPhoto: listItems.AttachmentJSON
              ? JSON.parse(listItems.AttachmentJSON)
                  ?.filter((data: any) => data.targetName === "visitorPhoto")
                  ?.map((data: any) => {
                    return {
                      ...data,
                      ID: listItems.ID,
                    };
                  })
              : [],
            visitorIdProof: listItems.AttachmentJSON
              ? JSON.parse(listItems.AttachmentJSON)
                  ?.filter((data: any) => data.targetName === "visitorIdProof")
                  .map((data: any) => {
                    return {
                      ...data,
                      ID: listItems.ID,
                    };
                  })
              : [],
          });

          console.log(
            "attachmentsssss",
            listItems.AttachmentJSON ? JSON.parse(listItems.AttachmentJSON) : []
          );
          console.log(
            "attachmentsssssvisitorIdProof",
            listItems.AttachmentJSON
              ? JSON.parse(listItems.AttachmentJSON)
                  ?.filter((data: any) => data.targetName === "visitorIdProof")
                  .map((data: any) => {
                    return {
                      ...data,
                      ID: listItems.ID,
                    };
                  })
              : []
          );
          console.log(
            "attachmentsssssvisitorPhoto",
            listItems.AttachmentJSON
              ? JSON.parse(listItems.AttachmentJSON)
                  ?.filter((data: any) => data.targetName === "visitorPhoto")
                  ?.map((data: any) => {
                    return {
                      ...data,
                      ID: listItems.ID,
                    };
                  })
              : []
          );
        });
    }
  }

  public onSubmit = async () => {
    const { context } = this.props;
    const { inputFeild, visitorPhoto, postAttachments, visitorIdProof } =
      this.state;
      const checkEmail = (Email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(Email);
        return !isValidEmail;
      };
  
      const checkMobileNo = (Number: any) => {
        // const mobileNumberRegex = /^\+?[1-9]\d{1,14}$/;
        const mobileNumberRegex = /^(\+[\d]{1,5}|0)?[1-9]\d{9}$/;
        const isValidNumber = !mobileNumberRegex.test(Number);
        console.log(isValidNumber, mobileNumberRegex, "mobile numbers testing");
        return isValidNumber;
      };

    const visitTime = this.state.inputFeild.visitorVisitTime;

    if (
      inputFeild.visitorName.length < 3 ||
      inputFeild.visitorName.length > 30
    ) {
      alert(
        "Visitor Name cannot be blank, should have more than 2 characters and less than 30 characters!"
      );
    } else if (checkEmail(inputFeild.visitorEmailId)) {
      alert("Invalid Email Address!");
    } else if (!inputFeild.visitorMobileNumber) {
      alert("Mobile Number cannot be blank!");
    } else if (checkMobileNo(inputFeild.visitorMobileNumber)) {
      alert("Invalid Mobile Number!");
    } else if (
      !inputFeild.visitorRelatedOrg ||
      inputFeild.visitorRelatedOrg.length < 3 ||
      inputFeild.visitorRelatedOrg.length > 30
    ) {
      alert(
        "Related Org/Company cannot be blank, should have more than 2 characters and less than 30 characters!"
      );
    } else if (!visitTime) {
      alert("Please enter the Anticipated visit time1");
    } else if (!visitorIdProof) {
      alert("Please Attach the IdProof!");
    } else if (!visitorPhoto) {
      alert("Please Attach the Photo!");
    } else {
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
          Visitorvisithour: new Date(inputFeild.visitorVisitTime).toString(),
          Visitornotify: inputFeild.visitorNotify,
          Visitorremarks: inputFeild.visitorRemarks,
          Filledby: context.pageContext.user.displayName,
          AttachmentJSON: JSON.stringify(this.state.attachmentJson),
          Filledbytype: "Blacklist",
        }),
      };
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('BlackList')/items`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log("visitor Created", postData);
        this.upload(postData.ID, postAttachments);
      } else {
        alert("blacklist form Failed.");
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
    }
  };

  public componentDidUpdate(
    prevProps: Readonly<IVisitRequestBlockListViewProps>,
    prevState: Readonly<IVisitRequestBlockListViewState>,
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
    const { visitorIdProofJSON, visitorPhotoJSON } = this.state;
    if (prevState.postAttachments !== this.state.postAttachments) {
      const attachmentPostJson = [visitorIdProofJSON, visitorPhotoJSON]?.filter(
        (data: any) => {
          if (Object.keys(data)?.length > 0) {
            return data;
          }
        }
      );

      this.setState({
        attachmentJson: attachmentPostJson,
      });
    }
    if (prevState.visitorPhoto !== this.state.visitorPhoto) {
      console.log("updateed data", this.state.visitorPhoto);
    }
  }
  public async upload(ID: number, Attachment: any) {
    console.log("In Attachment Post", Attachment);
    const postAttachment = [
      ...Attachment.visitorPhoto,
      ...Attachment.visitorIdProof,
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
      .getByTitle("BlackList")
      .items.getById(ID)
      .attachmentFiles.addMultiple(uniqueAttachmentData);
    console.log("Attachment Post Status", postResponse);
    window.history.go(-1);
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

                officeNumber: user.mobilePhone,
                mobileNumber: user.mobilePhone,
                officeLocation: user.officeLocation,
              },
            });
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

  public async getvisitordata(emailID: any) {
    const { context } = this.props;
    try {
      const graphClient = await context.msGraphClientFactory.getClient("3");
      const userResponse = await graphClient
        .api(`/users/${emailID}`)
        .version("v1.0")
        .select("*")
        .get();
      const userDetails = userResponse;
      console.log("USER DETAILS", userDetails);
      return userDetails;
    } catch (error) {
      console.error("USER FETCH ERROR", error);
      return [];
    }
  }
  
  public onChangePeoplePickerItems = async (items: any) => {
    const { peopleData } = this.state;

    console.log("item in peoplepicker", items);
    let finalData = peopleData?.filter((curr: any) =>
      items.find(
        (findData: any) => curr.userPrincipalName === findData.secondaryText
      )
    );
    if (finalData.length === 0) {
      finalData = items;
    }
    console.log(finalData, finalData[0].text, finalData[0].id, "finalData");
    const emailID = finalData[0].secondaryText;
    const userDetails = await this.getvisitordata(emailID);
    console.log("USER DETAILS", userDetails);
    this.setState({
      people: finalData,
      inputFeild: {
        ...this.state.inputFeild,
        visitedEmployeeID: finalData[0].id.toString(),
        visitedEmployeeName:userDetails.displayName,
        visitedEmployeeEntity:userDetails.jobTitle,
        visitedEmployeePhone:userDetails.mobilePhone,
        visitedEmployeeGrade:""
      },
    });
  };

  public render(): React.ReactElement<IVisitRequestBlockListViewProps> {
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
      visitorIdProof,
      visitorPhoto,
      language,
      checkBox,
      
      autoComplete,
      visitorIdProofJSON,
      visitorPhotoJSON,
      postAttachments,
      attachmentJson,
    } = this.state;
    const { context } = this.props;

    

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
        const regex = /\.(pdf|PDF|jpg|jpeg|png|gif)$/i;
        if (!regex.test(fileName)) {
          alert("Please select an Valid File.");
        } else {
          if (targetName === "visitorIdProof") {
            this.setState({
              visitorIdProof: event.target.files,
              visitorIdProofJSON: {
                targetName: targetName,
                fileName: fileName,
              },
            });
          } else if (targetName === "visitorPhoto") {
            this.setState({
              visitorPhoto: event.target.files,
              visitorPhotoJSON: {
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
    console.log("visitorPhoto", visitorPhoto, visitorIdProof);
    console.log(
      "Target Name",
      visitorPhotoJSON,
      visitorIdProofJSON,
      attachmentJson
    );

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
            Visitor Request (Black List View)
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
          <form>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En"
                ? " Requestor Information"
                : "معلومات مقدم الطلب"}
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                disabled={true}
                autoComplete={autoComplete}
                label={language === "En" ? "Staff Name" : "اسم الموظفين"}
                name="staffName"
                state={inputFeild}
                inputFeild={inputFeild.staffName}
              />
              <InputFeild
                type="text"
                disabled={true}
                label={language === "En" ? "Grade" : "درجة"}
                name="grade"
                autoComplete="off"
                state={inputFeild}
                inputFeild={inputFeild.grade}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                disabled={true}
                autoComplete="off"
                label={language === "En" ? "ID Number" : "رقم الهوية"}
                name="staffId"
                state={inputFeild}
                inputFeild={inputFeild.staffId}
                self={this}
              />
              <InputFeild
                type="text"
                disabled={true}
                autoComplete="off"
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
                autoComplete="off"
                label={language === "En" ? "Office Location " : "موقع المكتب "}
                name="officeLocation"
                state={inputFeild}
                inputFeild={inputFeild.officeLocation}
                self={this}
              />
              <InputFeild
                type="text"
                disabled={true}
                label={language === "En" ? "Office Number" : " مكتب نومبر "}
                autoComplete="off"
                name="officeNumber"
                state={inputFeild}
                inputFeild={inputFeild.officeNumber}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                disabled={true}
                autoComplete="off"
                label={language === "En" ? "Mobile Number " : "رقم الموبايل "}
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
                autoComplete="off"
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
                <div
                  style={{ marginLeft: "10px", width: "25%" }}
                  className={"custom-people-picker"}
                >
                  <PeoplePicker
                    context={context as any}
                    disabled={!checkBox}
                    personSelectionLimit={1}
                    showtooltip={true}
                    required={true}
                    onChange={(i: any) => {
                      this.onChangePeoplePickerItems(i);
                    }}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                    ensureUser={true}

                    // styles={{ peoplePicker: { border: 'none' } }}
                  />
                </div>
                {/* <Select
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
                /> */}
              </div>
            </div>
            {checkBox && (
              <div>
                <div
                  className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
                  style={{ backgroundColor: "#223771" }}
                >
                  {language === "En"
                    ? "Visited Employee Information"
                    : "معلومات الموظف الذي تمت زيارته"}
                </div>
                <div className="row">
                  <InputFeild
                    type="text"
                    autoComplete="off"
                    label={
                      language === "En"
                        ? "Visited Employee Name "
                        : "اسم الموظف الذي تمت زيارته "
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
                        : "هوية الموظف الذي تمت زيارته"
                    }
                    autoComplete="off"
                    name="visitedEmployeeID"
                    state={inputFeild}
                    inputFeild={inputFeild.visitedEmployeeID}
                    self={this}
                  />
                </div>
                <div className="row">
                  <InputFeild
                    type="text"
                    autoComplete="off"
                    label={
                      language === "En"
                        ? "Visited Employee Entity"
                        : "الجهة التي تمت زيارتها"
                    }
                    name="visitedEmployeeEntity"
                    state={inputFeild}
                    inputFeild={inputFeild.visitedEmployeeEntity}
                    self={this}
                  />
                  <InputFeild
                    type="text"
                    autoComplete="off"
                    label={
                      language === "En"
                        ? "Visited Employee Phone"
                        : "هاتف الموظف الذي تمت زيارته"
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
                    autoComplete="off"
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
              {language === "En" ? "Visitor Information" : "معلومات للزوار"}
            </div>
            <div
              className="d-flex justify-content-start text-danger py-2 mb-4 headerText"
              style={{ backgroundColor: "#C8CDDB" }}
            >
              {language === "En"
                ? "* Blacklisted visitor"
                : "* زائر مدرج في القائمة السوداء"}
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                autoComplete="off"
                label={
                  <>
                    {language === "En" ? "Visitor Name" : "اسم الزائر"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="visitorName"
                state={inputFeild}
                inputFeild={inputFeild.visitorName}
              />
              <InputFeild
                self={this}
                type="text"
                autoComplete="off"
                label={
                  <>
                    {language === "En" ? "Mobile Number" : "رقم الهاتف المحمول"}
                    <span className="text-danger">*</span>
                  </>
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
                autoComplete="off"
                label={
                  <>
                    {language === "En" ? "Email ID" : "عنوان الايميل"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="visitorEmailId"
                state={inputFeild}
                inputFeild={inputFeild.visitorEmailId}
              />
              <InputFeild
                type="select"
                label={language === "En" ? "Nationality" : "جنسية"}
                autoComplete="off"
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
                autoComplete="off"
                label={
                  <>
                    {language === "En"
                      ? "Related Org/Company"
                      : "المؤسسة/الشركة ذات الصلة"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="visitorRelatedOrg"
              
                state={inputFeild}
                inputFeild={inputFeild.visitorRelatedOrg}
                self={this}
              />

              <InputFeild
              type="datetime-local"
                label={
                  <>
                    {language === "En"
                      ? "Anticipated Visit Time"
                      : "وقت الزيارة المتوقع"}
                    <span className="text-danger">*</span>
                  </>
                }
                autoComplete="off"
                name="visitorVisitTime"
                state={inputFeild}
                inputFeild={inputFeild.visitorVisitTime}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="select"
                autoComplete="off"
                label={
                  <>
                    {language === "En" ? "Purpose of Visit" : "غرض الزيارة"}
                    {/* <span className="text-danger">*</span> */}
                  </>
                }
                name="visitorPurposeOfVisit"
                options={["PersonalVisit", "BuisnessVisit"]}
                state={inputFeild}
                inputFeild={inputFeild.visitorPurposeOfVisit}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="file"
                autoComplete={autoComplete}
                label={
                  <>
                    {language === "En"
                      ? "Attach ID Proof"
                      : "إرفاق إثبات الهوية"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="visitorIdProof"
                self={this}
                state={visitorIdProof}
                fileData={visitorIdProof}
                handleFileChange={handleFileChange}
              />
              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {visitorIdProof?.length > 0 && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {visitorIdProof[0]?.name || visitorIdProof[0]?.fileName}
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
                autoComplete={autoComplete}
                type="file"
                label={
                  <>
                    {language === "En"
                      ? "Attach Visitor Photograph"
                      : "إرفاق صورة الزائر"}
                    <span className="text-danger">*</span>
                  </>
                }
                name="visitorPhoto"
                state={visitorPhoto}
                fileData={visitorPhoto}
                self={this}
                handleFileChange={handleFileChange}
              />

              <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
                {visitorPhoto?.length > 0 && (
                  <div
                    className="d-flex justify-content-between w-100"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <span
                      className="ps-2 py-2"
                      style={{ fontSize: "1em", fontWeight: "600" }}
                    >
                      {visitorPhoto[0]?.name || visitorPhoto[0]?.fileName}
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
                self={this}
                type="textArea"
                autoComplete={autoComplete}
                label={language === "En" ? "Remarks " : "ملاحظات "}
                name="visitorRemarks"
                state={inputFeild}
                inputFeild={inputFeild.visitorRemarks}
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
