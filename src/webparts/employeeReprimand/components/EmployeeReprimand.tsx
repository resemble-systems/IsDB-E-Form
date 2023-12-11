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
  peopleData: any;
  conditionCheckBox: any;
  alreadyExist: any;
  commentsPost: any;
  fileInfos: any;
  uploadFileData: any;
  attachments: any;
  listId: any;
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
      peopleData: [],
      conditionCheckBox: false,
      alreadyExist: "",
      commentsPost: "",
      fileInfos: [],
      uploadFileData: [],
      attachments: "",
      listId: 0,
    };
  }

  public componentDidMount() {
    const { context } = this.props;
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
            });
          });
      });
  }

  public addFile = (event: { target: { name: any; files: any } }) => {
    console.log(`Attachment ${event.target.name}`, event.target.files);
    const { uploadFileData,fileInfos } = this.state;
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
      conditionCheckBox,
      // alreadyExist,
      people,
      commentsPost,
      candleCheckBox,
      smokeCheckBox,
      wrongParkCheckBox,
      speedCheckBox,
      leakageCheckBox,
      leaveEngineCheckBox,
      outOfHoursCheckBox,
      drivingCheckBox,
      // attachments,
      // fileInfos,
    } = this.state;

    if (conditionCheckBox == false) {
      alert("Please Agree the Terms and Conditions!");
    } else if (people.length < 1) {
      alert("User Name cannot be blank!");
    } else {
      let peopleArr = people;
      console.log("people on submit", peopleArr, people);
      // peopleArr.map((post: any) => {
      //   console.log("post on submit", post);
      //   const existingUser = alreadyExist?.filter(
      //     (data: any) =>
      //       data.Email.toLowerCase() === post.secondaryText.toLowerCase()
      //   );
      //   if (existingUser?.length > 0) {
      //     alert(`${post.text} is already a member.`);
      //   } else {
        const headers: any = {
          "X-HTTP-Method": "MERGE",
          "If-Match": "*",
          "Content-Type": "application/json;odata=nometadata",
        };

      const spHttpClintOptions: ISPHttpClientOptions =
        window.location.href.indexOf("?itemID") != -1
          ? {
              headers,
              body: JSON.stringify({
                Title: inputFeild.requestType,
                VisitedEntity: inputFeild.entity,
                Department: inputFeild.department,
                Violator: inputFeild.violator,
                VisitorID: inputFeild.id.toString(),
                OtherViolation: inputFeild.otherViolation,
                Comments: commentsPost,
                CandleCheckBox: candleCheckBox.toString(),
                SmokingCheckBox: smokeCheckBox.toString(),
                WrongParkCheckBox: wrongParkCheckBox.toString(),
                SpeedCheckBox: speedCheckBox.toString(),
                LeakageCheckBox: leakageCheckBox.toString(),
                LeaveEngineCheckBox: leaveEngineCheckBox.toString(),
                OutOfHoursCheckBox: outOfHoursCheckBox.toString(),
                DriveCheckBox: drivingCheckBox.toString(),
               
                OnBehalfOfEmail: JSON.stringify(peopleArr),
                
              }),
            }
          : {
              body: JSON.stringify({
                Title: inputFeild.requestType,
                VisitedEntity: inputFeild.entity,
                Department: inputFeild.department,
                Violator: inputFeild.violator,
                VisitorID: inputFeild.id.toString(),
                OtherViolation: inputFeild.otherViolation,
                Comments: commentsPost,
                CandleCheckBox: candleCheckBox.toString(),
                SmokingCheckBox: smokeCheckBox.toString(),
                WrongParkCheckBox: wrongParkCheckBox.toString(),
                SpeedCheckBox: speedCheckBox.toString(),
                LeakageCheckBox: leakageCheckBox.toString(),
                LeaveEngineCheckBox: leaveEngineCheckBox.toString(),
                OutOfHoursCheckBox: outOfHoursCheckBox.toString(),
                DriveCheckBox: drivingCheckBox.toString(),
                OnBehalfOfEmail: JSON.stringify(peopleArr),
               
              }),
            };
            console.log("spHttpClintOptions",spHttpClintOptions)

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
      } else {
        console.log("Response", Response);
      }
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
      leaveEngineCheckBox,
      outOfHoursCheckBox,
      drivingCheckBox,
      conditionCheckBox,
      attachments,
      fileInfos,
      commentsPost,
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
                    {language === "En" ? "On Behalf Of" : "نيابة عن"}
                    <span className="text-danger">*</span>
                  </label>
                </div>
                <div>
                  <PeoplePicker
                    context={context as any}
                    personSelectionLimit={10}
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
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label={language === "En" ? "Department" : "قسم"}
                name="department"
                state={inputFeild}
                inputFeild={inputFeild.department}
              />
              <InputFeild
                type="text"
                label={language === "En" ? "Violator" : "منتهك"}
                name="violator"
                state={inputFeild}
                inputFeild={inputFeild.violator}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                self={this}
                type="text"
                label={language === "En" ? "ID" : "معرف"}
                name="id"
                state={inputFeild}
                inputFeild={inputFeild.id}
              />
              <InputFeild
                type="text"
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
                rows={3}
                placeholder="Add a comment..."
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
                    {language === "En" ? "Attach Files" : ""}
                  </label>
                  <input
                    type="file"
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

            <div className="d-flex justify-content-start ps-2 mb-2">
              <input
                className="form-check"
                type="checkbox"
                checked={conditionCheckBox}
                onChange={(event) => {
                  this.setState({
                    conditionCheckBox: event.target.checked,
                  });
                }}
              />
              <label className={`ps-4`}>
                <a href="#">
                  {" "}
                  {language === "En"
                    ? "I agree to Terms & Conditions"
                    : "أوافق على الشروط والأحكام"}
                </a>
                <span className="text-danger">*</span>
              </label>
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
