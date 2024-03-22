import * as React from "react";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Row, Col, Select } from "antd";
import "./index.css";
import InputFeild from "./InputFeild";
import { Web } from "sp-pnp-js";
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
import type { IShiftReportProps } from "./IShiftReportProps";
import RichTextEditor from "../../../common-components/richTextEditor/RichTextEditor";
import { postData } from "../../../Services/Services";
import moment from "moment";

interface IShiftReportState {
  inputFeild: any;
  language: any;
  people: any;
  Assignpeople: any;
  peopleData: any;
  checkBox: any;
  commentsPost: any;
  buildingCommentsPost: any;
  fileInfos: any;
  uploadFileData: any;
  attachments: any;
  listId: any;
  maintenance: any;
  vehicleStatus: any;
  handOverChecklist: any;
  cleaning: any;
  redirection: boolean;
  approverComment: any;
  isAssignToFollowUp: any;
  uploadContent: {
    Date: string;
    Title: string;
    Location: string;
    Description: string;
    CreatedBy: string;
  };
  PendingWith: any;
  pendingApprover: any;
  showAssignToFollowUpDetails: boolean;
}

export default class ShiftReport extends React.Component<
  IShiftReportProps,
  IShiftReportState
> {
  public constructor(props: IShiftReportProps, state: IShiftReportState) {
    super(props);
    this.state = {
      inputFeild: {
        date: "",
        shift: "First Shift",
      },
      language: "En",
      people: [],
      Assignpeople: [],
      peopleData: [],
      checkBox: false,
      commentsPost: "",
      buildingCommentsPost: "",
      fileInfos: [],
      uploadFileData: [],
      attachments: "",
      listId: 0,
      maintenance: "",
      vehicleStatus: "",
      handOverChecklist: "",
      cleaning: "",
      redirection: false,
      approverComment: "",
      PendingWith: "Security Manager",
      isAssignToFollowUp: false,
      pendingApprover: "",
      showAssignToFollowUpDetails: false,
      uploadContent: {
        Date: "",
        Title: "",
        Location: "",
        Description: "",
        CreatedBy: "",
      },
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
    if (window.location.href.indexOf("?viewitemID") != -1) {
      console.log("CDM Banner inside if");
      const { context } = this.props;
      const { inputFeild } = this.state;
      context.spHttpClient
        .get(
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Shift-Report')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
          SPHttpClient.configurations.v1
        )
        .then((res: SPHttpClientResponse) => {
          return res.json();
        })
        .then((listItems: any) => {
          const extractedEmail = listItems?.OnBehalfOfEmail.replace(
            /^"(.*)"$/,
            "$1"
          );
          console.log("extractedEmail", extractedEmail);

          this.setState({
            inputFeild: {
              ...inputFeild,
              shift: listItems?.ShiftType,
              date: moment(listItems?.Title).format("DD-MM-YYYY HH:mm"),
              OnBehalfOfEmail: extractedEmail,
            },
            commentsPost: listItems?.CheckListStatus,
            buildingCommentsPost: listItems?.BuildingFloorDetails,
            fileInfos: listItems?.AttachmentFiles,
            maintenance: listItems?.MaintenanceWork,
            cleaning: listItems?.CleaningWork,
            vehicleStatus: listItems?.VehiclesStatus,
            handOverChecklist: listItems?.HandOver,
          });
          console.log("Res listItems", listItems);
          console.log(
            "date",
            moment(listItems?.Title).format("DD-MM-YYYY HH:mm")
          );
          console.log("mailid", listItems?.OnBehalfOfEmail);
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

      .getByTitle("Shift-Report")
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
    if (window.location.href.indexOf("?viewitemID") != -1) {
      console.log("attachment delete successfull", this.props, listId);
      let web = new Web(this.props.context.pageContext.web.absoluteUrl);
      web.lists
        .getByTitle("Shift-Report")
        .items.getById(listId)
        .attachmentFiles.getByName(files)
        .delete();
    }
  }

  public onSubmit = async () => {
    const { context } = this.props;
    const {
      inputFeild,
      people,
      buildingCommentsPost,
      maintenance,
      commentsPost,
      handOverChecklist,
      vehicleStatus,
      cleaning,
    } = this.state;

    if (people.length < 1) {
      alert("User Name cannot be blank!");
    } else if (!inputFeild.date) {
      alert("Please enter the Request Date!");
    } else {
      let peopleArr = people;
      console.log("people on submit", peopleArr, people);
      peopleArr?.map(async (post: any) => {
        console.log("post on submit", post);

        const headers: any = {
          "X-HTTP-Method": "POST",
          "If-Match": "*",
        };

        const spHttpClintOptions: ISPHttpClientOptions =
          window.location.href.indexOf("?viewitemID") != -1
            ? {
                headers,
                body: JSON.stringify({
                  Title: new Date(inputFeild.date).toString(),
                  OnBehalfOfName: JSON.stringify(peopleArr),
                  OnBehalfOfEmail: JSON.stringify(post.secondaryText),
                  ShiftType: inputFeild.shift,
                  CheckListStatus: commentsPost,
                  BuildingFloorDetails: buildingCommentsPost,
                  MaintenanceWork: maintenance,
                  CleaningWork: cleaning,
                  VehiclesStatus: vehicleStatus,
                  HandOver: handOverChecklist,
                }),
              }
            : {
                body: JSON.stringify({
                  Title: new Date(inputFeild.date).toString(),
                  OnBehalfOfName: JSON.stringify(peopleArr),
                  OnBehalfOfEmail: JSON.stringify(post.secondaryText),
                  ShiftType: inputFeild.shift,
                  CheckListStatus: commentsPost,
                  BuildingFloorDetails: buildingCommentsPost,
                  MaintenanceWork: maintenance,
                  CleaningWork: cleaning,
                  VehiclesStatus: vehicleStatus,
                  HandOver: handOverChecklist,
                }),
              };
        let data = window.location.href.split("=");
        let itemId = data[data.length - 1];
        let url =
          window.location.href.indexOf("?viewitemID") != -1
            ? `/_api/web/lists/GetByTitle('Shift-Report')/items('${itemId}')`
            : "/_api/web/lists/GetByTitle('Shift-Report')/items";

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
        } else {
          console.log("Response", Response);
        }
      });
    }
  };

  public onChangePeoplePickerItems = (items: any) => {
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
    console.log("onChangePeoplePickerItems", finalData, items);

    this.setState({
      people: finalData,
    });
  };
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

    this.setState({
      Assignpeople: finalData,
    });

    const emails = finalData.map((item: any) => item.secondaryText);
    this.setState({
      pendingApprover: emails || "",
    });
  };
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

            console.log("Selected User Details -------->", user);

            this.setState({
              inputFeild: {
                ...InputFeild,
                userEmail: user.mail,
              },
            });
          });
      });
  }
  public onApproveReject: (
    Type: string,
    PendingWith: string,
    comments: string
  ) => void = async (Type: string, PendingWith: string, comments?: string) => {
    const { context } = this.props;
    let url = window.location.href;
    let sub3 = url.indexOf("=") + 1;
    let itemID = url.substring(sub3);
    // let itemId = data[data.length - 1];
    // let itemID = url
    //   .split("?")[1]
    //   .split("&")
    //   .reduce(function (params, param) {
    //     let parts = param.split("=");
    //     if (parts[0] === "itemID") {
    //       params = parts[1];
    //     }
    //     return params;
    //   }, {});
    const postUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Shift-Report')/items('${itemID}')`;
    console.log("postUrl", postUrl);
    const headers = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };

    let body: string = JSON.stringify({
      Status: Type,
      pendingWith: PendingWith,
      comments: comments || "",
    });

    const updateInteraction = await postData(context, postUrl, headers, body);
    console.log(updateInteraction);
    // if (updateInteraction) this.getBasicBlogs();
  };
  public render(): React.ReactElement<IShiftReportProps> {
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
      commentsPost,
      buildingCommentsPost,
      fileInfos,
      maintenance,
      vehicleStatus,
      handOverChecklist,
      cleaning,
      redirection,
      PendingWith,
      showAssignToFollowUpDetails,
    } = this.state;
    const { context } = this.props;

    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Shift Report Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Shift Report Information
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
          <div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En"
                ? "Shift Report Information"
                : "معلومات تقرير التحول"}
            </div>

            <div className="row mb-2">
              {!redirection ? (
                <div className="d-flex justify-content-start py-2 ps-2">
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
                      {language === "En" ? "On behalf of" : "نيابة عن"}
                      <span className="text-danger">*</span>
                    </label>
                  </div>
                  <div
                    style={{ marginLeft: "10px", width: "25%" }}
                    className={"custom-people-picker"}
                  >
                    <PeoplePicker
                      context={context as any}
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
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <InputFeild
                    type="text"
                    disabled={redirection}
                    label={language === "En" ? "On behalf of" : "نيابة عن"}
                    name="on behalf of"
                    state={inputFeild}
                    inputFeild={inputFeild.OnBehalfOfEmail}
                    self={this}
                  />
                </div>
              )}
            </div>
            <div className="row">
              {!redirection ? (
                <InputFeild
                  type="datetime-local"
                  disabled={redirection}
                  label={
                    <>
                      {language === "En" ? "Date" : "تاريخ"}
                      <span className="text-danger">*</span>
                    </>
                  }
                  name="date"
                  state={inputFeild}
                  inputFeild={inputFeild.date}
                  self={this}
                />
              ) : (
                <InputFeild
                  type="text"
                  disabled={redirection}
                  label={
                    <>
                      {language === "En" ? "Date" : "تاريخ"}
                      <span className="text-danger">*</span>
                    </>
                  }
                  name="date"
                  state={inputFeild}
                  inputFeild={inputFeild.date}
                  self={this}
                />
              )}
              <InputFeild
                type="select"
                disabled={redirection}
                label={language === "En" ? "Shift" : "التحول"}
                name="shift"
                options={["First Shift", "Second Shift", "Third Shift"]}
                state={inputFeild}
                inputFeild={inputFeild.shift}
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
                <label className="ps-2 py-2" htmlFor="commentsPost">
                  {language === "En"
                    ? "Checklist Comments"
                    : "تعليقات قائمة التحقق"}
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
                <label className="ps-2 py-2" htmlFor="buildingCommentsPost">
                  {language === "En"
                    ? "Building Floors Comments"
                    : "تعليقات طوابق المبنى"}
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
                value={buildingCommentsPost}
                onChange={(e) =>
                  this.setState({ buildingCommentsPost: e.target.value })
                }
              />
            </div>

            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En" ? "About Information" : "حول المعلومات"}
            </div>

            <div>
              <div
                style={{
                  fontSize: "1em",
                  fontFamily: "Open Sans",
                  fontWeight: "600",
                  width: "24.5%",
                  backgroundColor: "#F0F0F0",
                  marginBottom: "8px",
                }}
              >
                <label className="ps-2 py-2" htmlFor="buildingCommentsPost">
                  {language === "En" ? "Maintenance" : "صيانة"}
                </label>
              </div>
              <RichTextEditor
                handleSubmit={""}
                // disabled={redirection}
                handleChange={(content: any) => {
                  this.setState({
                    maintenance: content,
                  });
                }}
                uploadContent={maintenance}
                placeholder={
                  language === "En" ? "Enter the data" : "أدخل البيانات"
                }
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
                  marginBottom: "8px",
                  marginTop: "8px",
                }}
              >
                <label className="ps-2 py-2" htmlFor="buildingCommentsPost">
                  {language === "En" ? "Cleaning Activity" : "نشاط التنظيف"}
                </label>
              </div>
              <RichTextEditor
                handleSubmit={""}
                // disabled={redirection}
                handleChange={(content: any) => {
                  this.setState({
                    cleaning: content,
                  });
                }}
                uploadContent={cleaning}
                placeholder={
                  language === "En" ? "Enter the data" : "أدخل البيانات"
                }
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
                  marginBottom: "8px",
                  marginTop: "8px",
                }}
              >
                <label className="ps-2 py-2" htmlFor="buildingCommentsPost">
                  {language === "En" ? "Vehicle Status" : "حالة المركبة"}
                </label>
              </div>
              <RichTextEditor
                handleSubmit={""}
                // disabled={redirection}
                handleChange={(content: any) => {
                  this.setState({
                    vehicleStatus: content,
                  });
                }}
                uploadContent={vehicleStatus}
                placeholder={
                  language === "En" ? "Enter the data" : "أدخل البيانات"
                }
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
                  marginBottom: "8px",
                  marginTop: "8px",
                }}
              >
                <label className="ps-2 py-2" htmlFor="buildingCommentsPost">
                  {language === "En"
                    ? "Handover Checklist"
                    : "قائمة التحقق من التسليم"}
                </label>
              </div>
              <RichTextEditor
                handleSubmit={""}
                // disabled={redirection}
                handleChange={(content: any) => {
                  this.setState({
                    handOverChecklist: content,
                  });
                }}
                uploadContent={handOverChecklist}
                placeholder={
                  language === "En" ? "Enter the data" : "أدخل البيانات"
                }
              />
            </div>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div
                  className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
                  style={{ backgroundColor: "#223771", marginTop: "8px" }}
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
                        {language === "En" ? "Attach Files" : "إرفاق ملف"}
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
              </Col>
            </Row>
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
            {redirection == true && (
              <div>
                {(PendingWith === "Security Manager" ||
                  PendingWith === "Assign to follow up") && (
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
                  </div>
                )}
                {PendingWith === "Security Manager" && (
                  <div>
                    <div className="d-flex justify-content-end mb-2 gap-3">
                      <button
                        className="px-4 py-2 text-white"
                        style={{ backgroundColor: "#223771" }}
                        type="button"
                        onClick={() => {
                          const { approverComment } = this.state;

                          if (PendingWith === "Security Manager") {
                            this.onApproveReject(
                              "Approve",
                              "Completed",
                              approverComment
                            );
                          } else {
                            this.onApproveReject(
                              "Approve",
                              "Completed",
                              approverComment
                            );
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
                          const { approverComment } = this.state;

                          if (PendingWith === "Security Manager") {
                            this.onApproveReject(
                              "Archive",
                              "Archive by Security Manager )",
                              approverComment
                            );
                          } else {
                            this.onApproveReject(
                              "Archive",
                              "Archive by Assigned User",
                              approverComment
                            );
                          }
                        }}
                      >
                        {language === "En" ? "Archive" : "أرشيف"}
                      </button>
                      <button
                        className="px-4 py-2 text-white"
                        style={{ backgroundColor: "#223771" }}
                        type="button"
                        onClick={() => {
                          const { approverComment } = this.state;
                          this.getDetails();
                          if (PendingWith === "Security Manager") {
                            this.onApproveReject(
                              "Return To User",
                              "Return To User",
                              approverComment
                            );
                          } else {
                            this.onApproveReject(
                              "Return To User",
                              "Return To User",
                              approverComment
                            );
                          }
                        }}
                      >
                        {language === "En"
                          ? "Return To User"
                          : "العودة إلى المستخدم"}
                      </button>
                      <button
                        className="px-4 py-2 text-white"
                        style={{ backgroundColor: "#223771" }}
                        type="button"
                        onClick={() => {
                          this.setState({ showAssignToFollowUpDetails: true });
                        }}
                      >
                        {language === "En"
                          ? "Assign to follow up"
                          : "تكليف بالمتابعة"}
                      </button>
                    </div>
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
                                "Please select a user to assign to follow up."
                              );
                              return;
                            }

                            this.onApproveReject(
                              "Assign to follow up",
                              "Assign to follow up",
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
                )}
                {PendingWith === "Assign to follow up" && (
                  <div className="d-flex justify-content-end mb-2 gap-3">
                    <button
                      className="px-4 py-2 text-white"
                      style={{ backgroundColor: "#223771" }}
                      type="button"
                      onClick={() => {
                        const { approverComment } = this.state;

                        this.onApproveReject(
                          "Return To Security Manager",
                          "Security Manager",
                          approverComment
                        );
                      }}
                    >
                      {language === "En"
                        ? "Return To Security Manager"
                        : "العودة إلى المستخدم"}
                    </button>
                    <button
                      className="px-4 py-2 text-white"
                      style={{ backgroundColor: "#223771" }}
                      type="button"
                      onClick={() => {
                        const { approverComment } = this.state;

                        this.onApproveReject(
                          "Archive",
                          "Archive by Assigned User",
                          approverComment
                        );
                      }}
                    >
                      {language === "En" ? "Archive" : "أرشيف"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CommunityLayout>
    );
  }
}
