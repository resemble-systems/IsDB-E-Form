import * as React from "react";
import type { ISafetyIncidentProps } from "./ISafetyIncidentProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Row, Col, Select } from "antd";
import "./index.css";
import InputFeild from "./InputFeild";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { Web } from "sp-pnp-js";
import { postData } from "../../../Services/Services";
// import { PeoplePicker,PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

interface ISafetyIncidentState {
  inputFeild: any;
  language: any;
  requestTypeData: any;
  entityData: any;
  checkBox: any;
  people: any;
  peopleData: any;
  conditionCheckBox: any;
  alreadyExist: any;
  commentsPost: any;
  descriptionPost: any;
  what: any;
  why: any;
  when: any;
  where: any;
  who: any;
  how: any;
  fileInfos: any;
  uploadFileData: any;
  attachments: any;
  listId: any;
  redirection: boolean;
  PendingWith:any,
}
export default class SafetyIncident extends React.Component<
  ISafetyIncidentProps,
  ISafetyIncidentState
> {
  public constructor(props: ISafetyIncidentProps, state: ISafetyIncidentState) {
    super(props);
    this.state = {
      inputFeild: {
        area: "Area - 1",
        requestType: "Incident - 1",
        entity: "Entity - 1",
      },
      language: "En",
      requestTypeData: [],
      entityData: [],
      commentsPost: "",
      descriptionPost: "",
      what: "",
      why: "",
      when: "",
      where: "",
      who: "",
      how: "",
      checkBox: false,
      conditionCheckBox: false,
      people: [],
      peopleData: [],
      alreadyExist: "",
      fileInfos: [],
      uploadFileData: [],
      attachments: "",
      listId: 0,
      redirection: false,
      PendingWith:"SSIMS Manager",
    };
  }
  public componentDidMount() {
    this.getEntity();
    this.getIncidentType();
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
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Safety-Incident')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
          SPHttpClient.configurations.v1
        )
        .then((res: SPHttpClientResponse) => {
          return res.json();
        })
        .then((listItems: any) => {
          this.setState({
            inputFeild: {
              ...inputFeild,
              requestType: listItems?.Title,
              entity: listItems?.Entity,
              area: listItems?.Area,
            },
            descriptionPost: listItems?.Description,
            commentsPost: listItems?.Comments,
            what: listItems?.What,
            when: listItems?.When,
            who: listItems?.Who,
            where: listItems?.Where,
            how: listItems?.How,
            why: listItems?.Why,
            fileInfos: listItems?.AttachmentFiles,
          });
          console.log("Res listItems", listItems);
        });
    }
  }

  public getIncidentType() {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Incident-Type')/items`,
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
  }

  public getEntity() {
    const { context } = this.props;
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

      .getByTitle("Safety-Incident")
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
        .getByTitle("Safety-Incident")
        .items.getById(listId)
        .attachmentFiles.getByName(files)
        .delete();
    }
  }

  public onSubmit = async () => {
    const { context } = this.props;
    const {
      inputFeild,
      what,
      why,
      when,
      who,
      where,
      how,
      descriptionPost,
      commentsPost,
    } = this.state;

    const headers: any = {
      "X-HTTP-Method": "POST",
      "If-Match": "*",
    };

    const spHttpClintOptions: ISPHttpClientOptions =
      window.location.href.indexOf("?itemID") != -1
        ? {
            headers,
            body: JSON.stringify({
              Title: inputFeild.requestType,
              Entity: inputFeild.entity,
              Area: inputFeild.area,
              Description: descriptionPost,
              Comments: commentsPost,
              What: what,
              When: when,
              Who: who,
              Where: where,
              How: how,
              Why: why,
            }),
          }
        : {
            body: JSON.stringify({
              Title: inputFeild.requestType,
              Entity: inputFeild.entity,
              Area: inputFeild.area,
              Description: descriptionPost,
              Comments: commentsPost,
              What: what,
              When: when,
              Who: who,
              Where: where,
              How: how,
              Why: why,
            }),
          };
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];

    let url =
      window.location.href.indexOf("?itemID") != -1
        ? `/_api/web/lists/GetByTitle('Safety-Incident')/items('${itemId}')`
        : "/_api/web/lists/GetByTitle('Safety-Incident')/items";
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
  };
  public onApproveReject: (Type: string, PendingWith: string) => void = async (
    Type: string,
    PendingWith: string
  ) => {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    const postUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Safety-Incident')/items('${itemId}')`;
    const headers = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };

    let body: any = {
      status: Type,
      PendingWith: PendingWith,
    };
    if (Type === "Approve") {
      const { people } = this.state;
      body.PeopleData = people.map((person: any) => person.secondaryText);
    }
  
    
    

    const updateInteraction = await postData(context, postUrl, headers, body);
    console.log(updateInteraction);
    // if (updateInteraction) this.getBasicBlogs();
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
  public render(): React.ReactElement<ISafetyIncidentProps> {
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
      requestTypeData,
      inputFeild,
      language,
      commentsPost,
      descriptionPost,
      entityData,
      what,
      why,
      where,
      how,
      who,
      when,
      fileInfos,
      redirection,
      PendingWith
    } = this.state;
    const { context } = this.props;

    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Safety Incident Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Safety Incident And Reporting
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
              {language === "En" ? "Incident Information" : "معلومات الحادث"}
            </div>
            <div className="row">
              <InputFeild
                type="select"
                disabled={redirection}
                label={language === "En" ? "Incident Type " : "نوع الحادث"}
                name="requestType"
                options={requestTypeData}
                state={inputFeild}
                inputFeild={inputFeild.requestType}
                self={this}
              />
              <InputFeild
                type="select"
                disabled={redirection}
                label={language === "En" ? "Entity " : "كيان "}
                name="entity"
                options={entityData}
                state={inputFeild}
                inputFeild={inputFeild.entity}
                self={this}
              />
            </div>

            <div className="row">
              <InputFeild
                type="select"
                disabled={redirection}
                label={language === "En" ? "Area" : "منطقة"}
                name="Area"
                options={["Area-1", "Area-2", "Area-3", "Area-4", "Area-5"]}
                state={inputFeild}
                inputFeild={inputFeild.area}
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
                <label className="ps-2 py-2" htmlFor="Description">
                  {language === "En" ? "Incident Description" : "وصف الحادث"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                disabled={redirection}
                rows={3}
                placeholder={language === "En" ? "Add a Incident Description..." : "إضافة وصف الحادث..."}
                required
                value={descriptionPost}
                onChange={(e) =>
                  this.setState({ descriptionPost: e.target.value })
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
                <label className="ps-2 py-2" htmlFor="onBehalfOf">
                  {language === "En" ? "Comments" : "التعليقات"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                disabled={redirection}
                rows={3}
                placeholder= {language === "En" ? "Add a comment..." : "اضف تعليق..."}
                required
                value={commentsPost}
                onChange={(e) =>
                  this.setState({ commentsPost: e.target.value })
                }
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En"
                ? "Initial Incident Investigation"
                : "التحقيق الأولي في الحادث"}
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
                <label className="ps-2 py-2" htmlFor="Description">
                  {language === "En" ? "What" : "ماذا"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                disabled={redirection}
                rows={3}
                placeholder={language === "En" ? "Add a comment..." : "اضف تعليق..."}
                required
                value={what}
                onChange={(e) => this.setState({ what: e.target.value })}
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
                <label className="ps-2 py-2" htmlFor="Description">
                  {language === "En" ? "Why" : "لماذا"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                disabled={redirection}
                rows={3}
                placeholder={language === "En" ? "Add a comment..." : "اضف تعليق..."}
                required
                value={why}
                onChange={(e) => this.setState({ why: e.target.value })}
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
                <label className="ps-2 py-2" htmlFor="Description">
                  {language === "En" ? "When" : "متى"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                disabled={redirection}
                rows={3}
                placeholder="Add a comments..."
                required
                value={when}
                onChange={(e) => this.setState({ when: e.target.value })}
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
                <label className="ps-2 py-2" htmlFor="Description">
                  {language === "En" ? "How" : "كيف"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                disabled={redirection}
                rows={3}
                placeholder={language === "En" ? "Add a comment..." : "اضف تعليق..."}
                required
                value={how}
                onChange={(e) => this.setState({ how: e.target.value })}
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
                <label className="ps-2 py-2" htmlFor="Description">
                  {language === "En" ? "Where" : "أين"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                disabled={redirection}
                rows={3}
                placeholder={language === "En" ? "Add a comment..." : "اضف تعليق..."}
                required
                value={where}
                onChange={(e) => this.setState({ where: e.target.value })}
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
                <label className="ps-2 py-2" htmlFor="Description">
                  {language === "En" ? "Who" : "من"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                disabled={redirection}
                rows={3}
                placeholder={language === "En" ? "Add a comment..." : "اضف تعليق..."}
                required
                value={who}
                onChange={(e) => this.setState({ who: e.target.value })}
              />
            </div>

            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En" ? "Attachments" : "المرفقات"}
            </div>
            <Row>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {" "}
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
         {PendingWith === "SSIMS Manager" && redirection == true && (
                <div className="d-flex justify-content-end mb-2 gap-3">
                  <button
                    className="px-4 py-2"
                    style={{ backgroundColor: "#223771" }}
                    type="button"
                    onClick={() => {
                      this.onApproveReject("Approve", "Completed");
                    }}
                  >
                    {language === "En" ? "Approve" : "يعتمد"}
                  </button>
                  <button
                    className="px-4 py-2 text-white"
                    style={{ backgroundColor: "#E5E5E5" }}
                    type="button"
                    onClick={() => {
                      this.onApproveReject("Reject","Rejected");
                    }}
                  >
                    {language === "En" ? "Reject" : "يرفض"}
                  </button>
                  <button
                    className="px-4 py-2 text-white"
                    style={{ backgroundColor: "#E5E5E5" }}
                    type="button"
                    onClick={() => {
                      this.onApproveReject("Archive","Archived");
                    }}
                  >
                    {language === "En" ? "Archive" : "أرشيف"}
                  </button>
                  {/* <div className="d-flex justify-content-start py-2 ps-2">
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
                  <label className="ps-2 py-2" htmlFor="To Notify">
                    {language === "En" ? "To Notify" : "بللإخطاراسم"}
                   
                  </label>
                 
                </div>
                <div
                  style={{ marginLeft: "10px", width: "25%" }}
                  className={"custom-people-picker"}
                >
                  <PeoplePicker
                    context={context as any}
                    disabled={false}
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
              </div> */}
                </div>
                
              )}
          </form>
        </div>
      </CommunityLayout>
    );
  }
}
