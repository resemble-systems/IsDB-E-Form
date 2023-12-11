import * as React from "react";
import type { ISafetyIncidentProps } from "./ISafetyIncidentProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Select } from "antd";
import "./index.css";
import InputFeild from "./InputFeild";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";

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
    };
  }
  public componentDidMount() {
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
  public onSubmit = () => {
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

    const spHttpClintOptions: ISPHttpClientOptions = {
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
    };

    context.spHttpClient
      .post(
        `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('Safety-Incident')/items`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((res: any) => {
        console.log("RES POST", res);
        alert(`You have successfully submitted`);
        window.history.go(-1);
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
              Incident Information
            </div>
            <div className="row">
              <InputFeild
                type="select"
                label={language === "En" ? "Incident Type " : "نوع الحادث"}
                name="requestType"
                options={requestTypeData}
                state={inputFeild}
                inputFeild={inputFeild.requestType}
                self={this}
              />
              <InputFeild
                type="select"
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
                rows={3}
                placeholder="Add a Incident Description..."
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
                rows={3}
                placeholder="Add a comment..."
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
              Initial Incident Investigation
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
                rows={3}
                placeholder="Add a comments..."
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
                rows={3}
                placeholder="Add a comments..."
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
                rows={3}
                placeholder="Add a comments..."
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
                rows={3}
                placeholder="Add a comments..."
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
                rows={3}
                placeholder="Add a comments..."
                required
                value={who}
                onChange={(e) => this.setState({ who: e.target.value })}
              />
            </div>

            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              Attachments
            </div>
           
            <div>
            <button
                className="px-4 py-2 text-white"
                style={{ backgroundColor: "#223771" }}
                type="button"
                onClick={() => {
                //  this.upLoad();
                }}
              >
                {language === "En" ? "AttachFiles" : "إرسال"}
              </button>
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
