import * as React from "react";
import type { IEmployeeReprimandProps } from "./IEmployeeReprimandProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Select } from "antd";
import "./index.css";
import InputFeild from "./InputFeild";
import {
  ISPHttpClientOptions,
  MSGraphClientV3,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Web } from "sp-pnp-js";
import { postData } from "../../../Services/Services";


interface IEmployeeReprimandState {
  inputFeild: any;
  language: any;
  requestTypeData: any;
  entityData: any;
  checkBox: any;
  candleCheckBox: any;
  smokeCheckBox: any;
  wrongParkCheckBox: any;
  speedCheckBox: any;
  leakageCheckBox: any;
  leaveEngineCheckBox: any;
  outOfHoursCheckBox: any;
  drivingCheckBox: any;
  people: any;
  violatorPeople: any;
  peopleData: any;
  violatorPeopleData: any;
  conditionCheckBox: any;
  alreadyExist: any;
  commentsPost: any;
  fileInfos: any;
  uploadFileData: any;
  attachments: any;
  listId: any;
  warningCount: any;
  redirection: boolean;
  isModalOpen: any;
  approverComment: any;
  checked: any;
  PendingWith: any;
  Assignpeople: any;
  isAssignToFollowUp: any;
  showAssignToFollowUpDetails: boolean;
  pendingApprover: any;
}
export default class EmployeeReprimand extends React.Component<
  IEmployeeReprimandProps,
  IEmployeeReprimandState
> {
  public constructor(
    props: IEmployeeReprimandProps,
    state: IEmployeeReprimandState
  ) {
    super(props);
    this.state = {
      inputFeild: {
        department: "",
        violator: "",
        id: "",
        position: "",
        otherViolation: "",
      
      },
      language: "En",
      requestTypeData: [],
      entityData: [],
      checkBox: false,
      candleCheckBox: false,
      smokeCheckBox: false,
      wrongParkCheckBox: false,
      speedCheckBox: false,
      leakageCheckBox: false,
      leaveEngineCheckBox: false,
      outOfHoursCheckBox: false,
      drivingCheckBox: false,
      people: [],
      violatorPeople: [],
      peopleData: [],
      violatorPeopleData: [],
      conditionCheckBox: false,
      alreadyExist: "",
      commentsPost: "",
      fileInfos: [],
      uploadFileData: [],
      attachments: "",
      listId: 0,
      redirection: false,
      warningCount: 0,
      isModalOpen: false,
      approverComment: "",
      checked: false,
      PendingWith: "SSIMS Reviewer",
      showAssignToFollowUpDetails: false,
      Assignpeople: [],
      pendingApprover: "",
      isAssignToFollowUp: false,
    };
  }

  public componentDidMount() {
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    if (window.location.href.indexOf("#view") != -1) {
      let itemIdn = itemId.split("#");
      itemId = itemIdn[0];
      this.setState({
        redirection: true,
      });
    }
    if (window.location.href.indexOf("?itemID") != -1) {
      console.log("CDM Banner inside if");
      const { context } = this.props;
      const { inputFeild } = this.state;
      context.spHttpClient
        .get(
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Employee-Reprimand')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
          SPHttpClient.configurations.v1
        )
        .then((res: SPHttpClientResponse) => {
          return res.json();
        })
        .then((listItems: any) => {
          // const extractedEmail = listItems?.OnBehalfOfEmail.replace(
          //   /^"(.*)"$/,
          //   "$1"
          // );
          // console.log("extractedEmail", extractedEmail);

          this.setState({
            inputFeild: {
              ...inputFeild,
              position: listItems?.Title,
              violator: listItems?.Violator,
              // OnBehalfOfEmail: extractedEmail,
              otherViolation: listItems?.OtherViolation,
              id: listItems?.VisitorID,
              department: listItems?.Department,
            },
            commentsPost: listItems?.Comments,
            candleCheckBox: listItems?.CandleCheckBox == "true" ? true : false,
            smokeCheckBox: listItems?.SmokingCheckBox == "true" ? true : false,
            wrongParkCheckBox:
              listItems?.WrongParkCheckBox == "true" ? true : false,
            speedCheckBox: listItems?.SpeedCheckBox == "true" ? true : false,
            leakageCheckBox:
              listItems?.LeakageCheckBox == "true" ? true : false,
            leaveEngineCheckBox:
              listItems?.LeaveEngineCheckBox == "true" ? true : false,
            outOfHoursCheckBox:
              listItems?.OutOfHoursCheckBox == "true" ? true : false,
            fileInfos: listItems?.AttachmentFiles,
            PendingWith: listItems?.pendingWith
          });
          console.log("Res listItems", listItems);
        });

      context.spHttpClient
        .get(
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Request-Goods')/items`,
          SPHttpClient.configurations.v1
        )
        .then((res: SPHttpClientResponse) => {
          return res.json();
        })
        .then((listItems: any) => {
          let requestTypeData = listItems.value?.map((data: any) => {
            return data.Title;
          });
          this.setState({
            requestTypeData: requestTypeData,
          });
          console.log("requestTypeData", requestTypeData);
        });
      context.spHttpClient
        .get(
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Visited-Entity')/items`,
          SPHttpClient.configurations.v1
        )
        .then((res: SPHttpClientResponse) => {
          return res.json();
        })
        .then((listItems: any) => {
          let filterData = listItems.value?.map((data: any) => {
            return data.Title;
          });
          this.setState({
            entityData: filterData,
          });
          console.log("filterData", filterData);
        });
      context.msGraphClientFactory
        .getClient("3")
        .then((graphClient: MSGraphClientV3): void => {
          graphClient
            .api(`/me/people`)
            .select("*")
            .top(999)
            .get((error: any, members: any, rawResponse?: any) => {
              console.log("Members in graph", members);
              if (error) {
                console.log("User members Error Msg:", error);
                return;
              }

              let mappedData = members?.value?.map((data: any) => {
                return {
                  ...data,
                  secondaryText: data.userPrincipalName,
                };
              });
              console.log("members========>>>>>>>>", mappedData, members.value);

              this.setState({
                peopleData: mappedData,
                violatorPeopleData: mappedData,
              });
            });
        });
    }
  }

  public addFile = (event: { target: { name: any; files: any } }) => {
    console.log(`Attachment ${event.target.name}`, event.target.files);
    const { uploadFileData, fileInfos } = this.state;
    let inputArr = event.target.files;
    let arrLength = event.target.files?.length;
    const targetName = event.target.name;
    let newArr: any = [];
    let fileData: any = [];
    for (let i = 0; i < arrLength; i++) {
      console.log(`In for loop ${i} times`);
      var file = inputArr[i];
      const fileName = inputArr[i].name;
      console.log("fileName", fileName);
      const regex = /\.(jpg|jpeg|png|gif|pdf|pptx|ppt|doc|docs|svg)$/i;
      if (!regex.test(fileName)) {
        alert("Please select an image file (jpg, jpeg, png, gif).");
      } else {
        var reader = new FileReader();
        reader.onload = (function (file) {
          return function (e: any) {
            fileData.push({
              name: file.name,
              content: e.target?.result,
              attachmentTarget: targetName,
            });
          };
        })(file);
        reader.readAsArrayBuffer(file);
        console.log("fileData Attachment", fileData);
        newArr = [...newArr, inputArr[i]];
      }
    }
    this.setState({
      fileInfos: [...fileInfos, ...newArr],
      uploadFileData: [...uploadFileData, fileData],
    });
  };

  private async upload(id: any) {
    const { uploadFileData } = this.state;
    let postArray = uploadFileData.reduce((a: any, b: any) => a.concat(b), []);
    console.log("attachment post successfull", this.props);
    let web = new Web(this.props.context.pageContext.web.absoluteUrl);
    web.lists

      .getByTitle("Employee-Reprimand")
      .items.getById(id)
      .attachmentFiles.addMultiple(postArray);
    console.log("attachment post successfull");
    this.setState({
      fileInfos: [],
      uploadFileData: [],
    });
    window.history.go(-1);
  }

  private deleteFiles(files: any) {
    let { listId } = this.state;
    if (window.location.href.indexOf("?itemID") != -1) {
      console.log("attachment delete successfull", this.props, listId);
      let web = new Web(this.props.context.pageContext.web.absoluteUrl);
      web.lists
        .getByTitle("Employee-Reprimand")
        .items.getById(listId)
        .attachmentFiles.getByName(files)
        .delete();
    }
  }
  public onSubmit = async () => {
    const { context } = this.props;
    const {
      inputFeild,
      violatorPeople,
      people,
      commentsPost,
      candleCheckBox,
      smokeCheckBox,
      wrongParkCheckBox,
      speedCheckBox,
      leakageCheckBox,
      leaveEngineCheckBox,
      outOfHoursCheckBox,
      PendingWith,
    } = this.state;

    // if (conditionCheckBox == false) {
    //   alert("Please Agree the Terms and Conditions!");
    // if (Position.length < 1) {
    //   alert("User Name cannot be blank!");
    // } else {
      let peopleArr = people;
      console.log("people on submit", peopleArr, people);
      // peopleArr?.map(async (post: any) => {
      //   console.log("post on submit", post);

      const headers: any = {
        "X-HTTP-Method": "POST",
        "If-Match": "*",
      };

      const spHttpClintOptions: ISPHttpClientOptions =
        window.location.href.indexOf("?itemID") != -1
          ? {
              headers,
              body: JSON.stringify({
                Title: inputFeild.position,
                Violator: violatorPeople[0].secondaryText,
                OtherViolation: inputFeild.otherViolation,
                VisitorID: inputFeild.id,
                Department: inputFeild.department,
                // OnBehalfOfName: JSON.stringify(peopleArr),
                //OnBehalfOfEmail: JSON.stringify(peopleArr[0].secondaryText),
                Comments: commentsPost,
                CandleCheckBox: candleCheckBox.toString(),
                SmokingCheckBox: smokeCheckBox.toString(),
                WrongParkCheckBox: wrongParkCheckBox.toString(),
                SpeedCheckBox: speedCheckBox.toString(),
                LeakageCheckBox: leakageCheckBox.toString(),
                LeaveEngineCheckBox: leaveEngineCheckBox.toString(),
                OutOfHoursCheckBox: outOfHoursCheckBox.toString(),
                WarningCount: this.state.warningCount,
                pendingWith: PendingWith
              }),
            }
          : {
              body: JSON.stringify({
                Title: inputFeild.position,
                Violator: violatorPeople[0].secondaryText,
                OtherViolation: inputFeild.otherViolation,
                VisitorID: inputFeild.id,
                Department: inputFeild.department,
                // OnBehalfOfName: JSON.stringify(peopleArr),
                //OnBehalfOfEmail: JSON.stringify(peopleArr[0].secondaryText),
                Comments: commentsPost,
                CandleCheckBox: candleCheckBox.toString(),
                SmokingCheckBox: smokeCheckBox.toString(),
                WrongParkCheckBox: wrongParkCheckBox.toString(),
                SpeedCheckBox: speedCheckBox.toString(),
                LeakageCheckBox: leakageCheckBox.toString(),
                LeaveEngineCheckBox: leaveEngineCheckBox.toString(),
                OutOfHoursCheckBox: outOfHoursCheckBox.toString(),
                WarningCount: this.state.warningCount,
                pendingWith: PendingWith
              }),
            };

      console.log("spHttpClintOptions", spHttpClintOptions);

      let data = window.location.href.split("=");
      let itemId = data[data.length - 1];

      let url =
        window.location.href.indexOf("?itemID") != -1
          ? `/_api/web/lists/GetByTitle('Employee-Reprimand')/items('${itemId}')`
          : "/_api/web/lists/GetByTitle('Employee-Reprimand')/items";

      const Response = await context.spHttpClient.post(
        `${context.pageContext.web.absoluteUrl}${url}`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (Response.ok) {
        const ResponseData = await Response.json();
        console.log("ResponseData", ResponseData);
        this.upload(ResponseData.ID);
        alert(`You have successfully submitted`);
        () => {
          context.spHttpClient
            .get(
              `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Employee-Reprimand')/items?$select=Violator&$filter=Violator eq '${inputFeild.violator}'`,
              SPHttpClient.configurations.v1
            )
            .then((res: SPHttpClientResponse) => {
              console.log("violation listItems Success");
              return res.json();
            })
            .then((listItems: any) => {
              console.log("violation Res listItems", listItems.value);
            });
        };
      } else {
        console.log("Response", Response);
      }
      // });
    
  };

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
    console.log("items", items[0].secondaryText);
    this.setState({
      people: finalData,
    });
  };

  public onChangePeoplePickerViolator = async (items: any) => {
    const { violatorPeopleData } = this.state;
    const { context } = this.props;
    console.log("item in peoplepicker", items, violatorPeopleData);
    let finalData = violatorPeopleData.filter((curr: any) =>
      items.find(
        (findData: any) => curr.userPrincipalName === findData.secondaryText
      )
    );
    if (finalData.length === 0) {
      finalData = items;
    }
    console.log("onChangePeoplePickerItems", finalData, items);

    try {
      const apiUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Employee-Reprimand')/items?$select=Violator&$filter=Violator eq '${items[0].secondaryText}'`;
      const res: SPHttpClientResponse = await context.spHttpClient.get(
        apiUrl,
        SPHttpClient.configurations.v1
      );
      if (!res.ok) {
        throw new Error("HTTP request failed with status" + res.status);
      }
      const listItems = await res.json();
      const violtorCount = listItems.value?.length + 1;
      console.log("count", violtorCount);
      this.setState({
        violatorPeople: finalData,
        warningCount: violtorCount,
      });
    } catch (error) {
      console.error("Error in Get Violator", error);
    }
    console.log("onChangePeoplePickerItems", finalData, items);
  };
  public onApproveReject: (
    Type: string,
    PendingWith: string,
    comments: string
  ) => void = async (Type: string, PendingWith: string, comments?: string) => {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    const postUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Employee-Reprimand')/items('${itemId}')`;
    const headers = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };

    let body: string;
    body = JSON.stringify({
      Status: Type,
      pendingWith: PendingWith,
      approverComments: comments || "",
    });
    if (PendingWith === "To Notify") {
      const { pendingApprover } = this.state;
      body = JSON.stringify({
        Status: Type,
        pendingWith: PendingWith,
        approverComments: comments || "",
      
        pendingApprover: pendingApprover,
      });
    }
    const updateInteraction = await postData(context, postUrl, headers, body);
    console.log(updateInteraction);
    if (updateInteraction) {
      alert("The form has been succesfully " + PendingWith + "!");
      window.history.go(-1);
    }
    // if (updateInteraction) this.getBasicBlogs();
  };
  // public onChange = (checked: boolean) => {
  //   console.log(`Switch to ${checked}`);
  //   this.setState({ checked, redirection: false });
  // };
  public handleAssign = (items: any) => {
    const { peopleData } = this.state;
    console.log("item in peoplepicker", items);
    let finalData = peopleData.filter((curr: any) =>
      items.find(
        (findData: any) => curr.userPrincipalName === findData.secondaryText
      )
    );
    if (finalData.length === 0) {
      finalData = items;
    }
    console.log("handle", finalData, items);
    
    const Assignpeople = finalData.length > 0 ? finalData[0].secondaryText : "";
    const pendingApprover = finalData.length > 0 ? finalData[0].secondaryText : "";

    this.setState({
      Assignpeople: Assignpeople,
      pendingApprover: pendingApprover,
    });

    console.log("Assignpeople", Assignpeople);
    console.log("pendingApprover", pendingApprover);
};
  public render(): React.ReactElement<IEmployeeReprimandProps> {
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
      language,
      candleCheckBox,
      smokeCheckBox,
      wrongParkCheckBox,
      speedCheckBox,
      leakageCheckBox,
      redirection,
      leaveEngineCheckBox,
      outOfHoursCheckBox,
      drivingCheckBox,
      attachments,
      fileInfos,
      commentsPost,
      PendingWith,
      showAssignToFollowUpDetails
    } = this.state;
    const { context } = this.props;
    console.log("attachments", attachments);
    console.log(fileInfos, "fileinformation");
    console.log("changesNew");
    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Employee Reprimand Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Employee Reprimand
          </div>
          <div
            className="d-flex justify-content-center text-danger py-2 mb-4 headerText"
            style={{ backgroundColor: "#C8CDDB" }}
          >
            Please fill out the fields in * to proceed
          </div>
          <div className="d-flex justify-content-end mb-2">
            {/* {PendingWith === "SSIMS Reviewer" && (
              <div className="">
                Edit
                <Switch onChange={this.onChange} />
              </div>
            )} */}
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
              {language === "En" ? "Visitor Information" : "معلومات للزوار"}
            </div>
            <div className="row">
              <div className="d-flex justify-content-start py-2 ps-2">
                <InputFeild
                  self={this}
                  type="text"
                  disabled={redirection}
                  label={language === "En" ? "Department" : "قسم"}
                  name="department"
                  state={inputFeild}
                  inputFeild={inputFeild.department}
                />
                {!redirection ? (
                  <div
                  className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2"
                  style={{ paddingLeft: "12px" }}
                >
                  <div
                    style={{
                      fontSize: "1em",
                      fontFamily: "Open Sans",
                      fontWeight: "600",
                      width: "50%",
                      backgroundColor: "#F0F0F0",
                    }}
                  >
                  <label className="ps-2 py-2" htmlFor="onBehalfOf">
                    {language === "En" ? "Violator" : "منتهك"}
                    {/* <span className="text-danger">*</span> */}
                  </label>
                </div>
                <div
                  style={{ marginLeft: "10px", width: "50%" }}
                  className={"custom-people-picker"}
                >
                  <PeoplePicker
                    context={context as any}
                    disabled={redirection}
                    personSelectionLimit={1}
                    showtooltip={true}
                    required={true}
                    onChange={(i: any) => {
                      this.onChangePeoplePickerViolator(i);
                    }}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000}
                    ensureUser={true}

                    // styles={{ peoplePicker: { border: 'none' } }}
                  />
                </div>
                </div>
                 
                    
                 ) : (
                  <div>
                    <InputFeild
                      type="text"
                      disabled={redirection}
                      label={language === "En" ? "Violator" : "نيابة عن"}
                      name="violator"
                      state={inputFeild}
                      inputFeild={inputFeild.violator}
                      self={this}
                    />
                  </div>
                )}
                   </div>
            </div>
          
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                disabled={redirection}
                label={language === "En" ? "ID" : "معرف"}
                name="id"
                state={inputFeild}
                inputFeild={inputFeild.id}
              />
              <InputFeild
                type="text"
                disabled={redirection}
                label={language === "En" ? "Position" : "موضع"}
                name="position"
                state={inputFeild}
                inputFeild={inputFeild.position}
                self={this}
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En" ? "Violation Information" : "معلومات المخالفة"}
            </div>

            <div className="row">
              <InputFeild
                type="text"
                disabled={redirection}
                label={language === "En" ? "Other Violation" : "انتهاكات أخرى"}
                name="otherViolation"
                state={inputFeild}
                inputFeild={inputFeild.otherViolation}
                self={this}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: "1em",
                  fontFamily: "Open Sans",
                  fontWeight: "600",
                  width: "24.5%",
                  backgroundColor: "#F0F0F0",
                }}
              >
                <label className="ps-2 py-2" htmlFor="onBehalfOf">
                  {language === "En" ? "Comments" : "التعليقات"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                disabled={redirection}
                rows={3}
                placeholder={
                  language === "En" ? "Add a comment..." : "أضف تعليقا..."
                }
                required
                value={commentsPost}
                onChange={(e) =>
                  this.setState({ commentsPost: e.target.value })
                }
              />
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={candleCheckBox}
                onChange={(event) => {
                  this.setState({
                    candleCheckBox: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En"
                  ? "Lighting candles,incense in the office"
                  : "إضاءة الشموع والبخور في المكتب"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={smokeCheckBox}
                onChange={(event) => {
                  this.setState({
                    smokeCheckBox: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En" ? "Smoking" : "تدخين"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkBox"
                checked={wrongParkCheckBox}
                onChange={(event) => {
                  this.setState({
                    wrongParkCheckBox: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En" ? "Wrong parking" : "وقوف السيارات خاطئة"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={speedCheckBox}
                onChange={(event) => {
                  this.setState({
                    speedCheckBox: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En"
                  ? "Over speed limit"
                  : "تجاوز الحد الأقصى للسرعة"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={leakageCheckBox}
                onChange={(event) => {
                  this.setState({
                    leakageCheckBox: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En" ? "Oil leakage" : "تسرب النفط"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={leaveEngineCheckBox}
                onChange={(event) => {
                  this.setState({
                    leaveEngineCheckBox: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En"
                  ? "Leave engine running in the parking"
                  : "اترك المحرك يعمل في موقف السيارات"}
              </label>
            </div>

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={outOfHoursCheckBox}
                onChange={(event) => {
                  this.setState({
                    outOfHoursCheckBox: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En"
                  ? "Parking out of working hours"
                  : "وقوف السيارات خارج ساعات العمل"}
              </label>
            </div>
            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                disabled={redirection}
                type="checkbox"
                checked={drivingCheckBox}
                onChange={(event) => {
                  this.setState({
                    drivingCheckBox: event.target.checked,
                  });
                }}
              />
              <label className={`ps-3`}>
                {language === "En"
                  ? "Wrong side driving"
                  : "القيادة الجانبية الخاطئة"}
              </label>
            </div>

            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En" ? "Attachments" : "المرفقات"}
            </div>

            <div>
              <div className={`d-flex align-items-center`}>
                <button className={`newsAttachmentButton`} type="button">
                  <img
                    src={require("../../../common-assets/attachment.svg")}
                    alt=""
                    height="20px"
                    width="20px"
                    className={`img1`}
                  />
                  <label className={`px-2 newsAttachment`} htmlFor="doc">
                    {language === "En" ? "Attach Files" : "إرفاق الملفات"}
                  </label>
                  <input
                    type="file"
                    disabled={redirection}
                    id="doc"
                    multiple={true}
                    accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: "none" }}
                    onChange={this.addFile}
                  ></input>
                </button>
                <div className={`ms-3 title`}>
                  {`${fileInfos?.length == 0 ? `No` : fileInfos?.length} ${
                    fileInfos?.length == 1 ? `File` : `Files`
                  } Chosen`}
                </div>
              </div>
              <div className="pt-3">
                {fileInfos?.length > 0 &&
                  fileInfos.map((file: any, i: any) => (
                    <div
                      className={`p-2 mb-3 d-flex justify-content-between align-items-center fileInfo`}
                    >
                      <div className={`fileName`}>
                        {file?.FileName || file?.name}
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        className="text-danger"
                        onClick={() => {
                          const { uploadFileData } = this.state;
                          let postArray = uploadFileData.reduce(
                            (a: any, b: any) => a.concat(b),
                            []
                          );
                          fileInfos.splice(i, 1);
                          postArray.splice(i, 1);

                          this.deleteFiles(file?.FileName || file?.name);
                          this.setState({
                            fileInfos,
                            uploadFileData: postArray,
                          });
                        }}
                      >
                        X
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {redirection == false && (
              <div className="d-flex justify-content-end mb-2 gap-3">
                <button
                  className="px-4 py-2"
                  disabled={redirection}
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
                  disabled={redirection}
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
            {((PendingWith === "SSIMS Reviewer" ||
              PendingWith === "SSIMS Manager") &&
              redirection == true) && (
                <div>
                  <div
                    style={{
                      fontSize: "1em",
                      fontFamily: "Open Sans",
                      fontWeight: "600",
                      width: "24.5%",
                      backgroundColor: "#F0F0F0",
                    }}
                  >
                    <label className="ps-2 py-2" htmlFor="approverComment">
                      {language === "En"
                        ? "Approver Comment"
                        : "تعليقات الموافق"}
                    </label>
                  </div>
                  <textarea
                    className="form-control mb-2 mt-2"
                    rows={3}
                    placeholder={
                      language === "En" ? "Add a comment..." : "أضف تعليقا..."
                    }
                    value={this.state.approverComment}
                    onChange={(e) =>
                      this.setState({ approverComment: e.target.value })
                    }
                  />
                  <div className="d-flex justify-content-end mb-2 gap-3">
                   
                    <button
                      className="px-4 py-2 text-white"
                      style={{ backgroundColor: "#E5E5E5" }}
                      type="button"
                      onClick={() => {
                        const { approverComment } = this.state;

                        if (PendingWith === "SSIMS Reviewer") {
                          this.onApproveReject(
                            "Archive",
                            "Archived by SSIMS Reviewer",
                            approverComment
                          );
                        } else {
                          this.onApproveReject(
                            "Archive",
                            "Archived",
                            approverComment
                          );
                        }
                      }}
                    >
                      {language === "En" ? "Archive" : "أرشيف"}
                    </button>
                    <button
                      className="px-4 py-2 text-white"
                      style={{ backgroundColor: "#E5E5E5" }}
                      type="button"
                      onClick={() => {
                        this.setState({ showAssignToFollowUpDetails: true });
                      }}
                    >
                      {language === "En"
                        ? "To Notify"
                        : "إشعار آخرين"}
                    </button>
                    {showAssignToFollowUpDetails && (
                    <div className="d-flex justify-content-end">
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
                        <label className="ps-2 py-2" htmlFor="Assign To">
                          {language === "En" ? "Assign To" : "باسم"}
                        </label>
                      </div>
                      <PeoplePicker
                        context={context as any}
                        personSelectionLimit={1}
                        showtooltip={true}
                        required={true}
                        onChange={(i: any) => {
                          this.handleAssign(i);
                        }}
                        showHiddenInUI={false}
                        principalTypes={[PrincipalType.User]}
                        resolveDelay={1000}
                        ensureUser={true}
                      />
                      <button
                        className="px-4 py-2 text-white"
                        style={{ backgroundColor: "#223771" }}
                        type="button"
                        onClick={() => {
                          const { approverComment } = this.state;
                          if (!this.state.Assignpeople) {
                            alert(
                              "Please select a user to Notify."
                            );
                            return;
                          }

                          this.onApproveReject(
                            "To Notify",
                            "To Notify",
                            approverComment
                          );

                          this.setState({ isAssignToFollowUp: false });
                        }}
                      >
                        {language === "En" ? "Submit" : "يُقدِّم"}
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              )}
          </form>
        </div>
      </CommunityLayout>
    );
  }
}
