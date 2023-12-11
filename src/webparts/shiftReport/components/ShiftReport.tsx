import * as React from "react";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Select } from "antd";
import "./index.css";
import InputFeild from "./InputFeild";
import {
  ISPHttpClientOptions,
  MSGraphClientV3,
  SPHttpClient,
} from "@microsoft/sp-http";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import type { IShiftReportProps } from "./IShiftReportProps";
interface IShiftReportState {
  inputFeild: any;
  language: any;
  people: any;
  peopleData: any;
  checkBox: any;
  commentsPost: any;
  buildingCommentsPost: any;
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
      peopleData: [],
      checkBox: false,
      commentsPost: "",
      buildingCommentsPost: "",
    };
  }
  public componentDidMount() {
    const { context } = this.props;

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

  public onSubmit = () => {
    const { context } = this.props;
    const { inputFeild, people } = this.state;

    if (people.length < 1) {
      alert("User Name cannot be blank!");
    } else {
      let peopleArr = people;
      console.log("people on submit", peopleArr, people);

      const headers: any = {
        "X-HTTP-Method": "POST",
        "If-Match": "*",
      };

      const spHttpClintOptions: ISPHttpClientOptions =
        window.location.href.indexOf("?itemID") != -1
          ? {
              headers,
              body: JSON.stringify({
                Title: inputFeild.date,
              }),
            }
          : {
              body: JSON.stringify({
                Title: inputFeild.requestType,
              }),
            };
      let data = window.location.href.split("=");
      let itemId = data[data.length - 1];
      let url =
        window.location.href.indexOf("?itemID") != -1
          ? `/_api/web/lists/GetByTitle('Shift-Report')/items('${itemId}')`
          : "/_api/web/lists/GetByTitle('Shift-Report')/items";

      context.spHttpClient
        .post(
          `${context.pageContext.web.absoluteUrl}${url}`,
          SPHttpClient.configurations.v1,
          spHttpClintOptions
        )
        .then((res) => {
          console.log("RES POST", res);
          alert(`You have successfully submitted`);
          // window.history.go(-1);
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
      checkBox,
      commentsPost,
      buildingCommentsPost,
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
              Shift Report Information
            </div>

            <div className="row mb-2">
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
                    <span className="text-danger">*</span>
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
              </div>
              {checkBox && (
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
              )}
            </div>

            <div className="row">
              <InputFeild
                type="date"
                label={language === "En" ? "Date" : "نوع الطلب "}
                name="date"
                state={inputFeild}
                inputFeild={inputFeild.date}
                self={this}
              />
              <InputFeild
                type="select"
                label={language === "En" ? "Shift" : "كيان الموظف"}
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
                  {language === "En" ? "Checklist Comments" : "التعليقات"}
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
                  {language === "En" ? "Building Floors Comments" : "التعليقات"}
                </label>
              </div>
              <textarea
                className="form-control mb-2 mt-2"
                rows={3}
                placeholder="Add a comment..."
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
              {language === "En" ? "About Information" : "المرفقات"}
            </div>

            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
             {language === "En" ? "Attachments" : "المرفقات"}
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
          </div>
        </div>
      </CommunityLayout>
    );
  }
}
