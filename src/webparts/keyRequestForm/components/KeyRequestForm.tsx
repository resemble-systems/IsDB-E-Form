import * as React from "react";
import type { IKeyRequestFormProps } from "./IKeyRequestFormProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Select, Modal } from "antd";
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
import { postData } from "../../../Services/Services";

interface IKeyRequestFormState {
  inputFeild: any;
  language: any;
  requestTypeData: any;
  entityData: any;
  checkBox: any;
  doorCheckBox: any;
  deskCheckBox: any;
  cabinetCheckBox: any;
  safeCheckBox: any;
  drawerCheckBox: any;
  people: any;
  peopleData: any;
  conditionCheckBox: any;
  alreadyExist: any;
  isModalOpen: any;
  redirection: any;
  PendingWith: any;
  pendingApprover: any;
}
export default class KeyRequestForm extends React.Component<
  IKeyRequestFormProps,
  IKeyRequestFormState
> {
  public constructor(props: IKeyRequestFormProps, state: IKeyRequestFormState) {
    super(props);
    this.state = {
      inputFeild: {
        staffName: "",
        requestType: "Key Request",
        entity: "Entity - 1",
        number: "",
        floor: "1",
        DDMenu: "New Office",
      },
      language: "En",
      requestTypeData: [],
      entityData: [],
      doorCheckBox: false,
      deskCheckBox: false,
      cabinetCheckBox: false,
      safeCheckBox: false,
      drawerCheckBox: false,
      checkBox: false,
      conditionCheckBox: false,
      people: [],
      peopleData: [],
      alreadyExist: "",
      isModalOpen: false,
      redirection: false,
      PendingWith: "",
      pendingApprover: "",
    };
  }
  public componentDidMount() {
    const { context } = this.props;
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
      this.getData(itemId);
    }
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Request-Type')/items`,
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
  public getData(itemId: any) {
    const { context } = this.props;
    const { inputFeild } = this.state;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Key-Request')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((listItems: any) => {
        console.log("listItems", listItems);
        this.setState({
          inputFeild: {
            ...inputFeild,
            requestType: listItems?.Title,
            entity: listItems?.EmployeeEntity,
            floor: listItems?.Floor,
            number: listItems?.officeNumber,
            DDMenu: listItems?.DDMenu,
          },
          doorCheckBox: listItems?.Door == "true" ? true : false,
          deskCheckBox: listItems?.officeDesk == "true" ? true : false,
          cabinetCheckBox: listItems?.cabinet == "true" ? true : false,
          safeCheckBox: listItems?.officeSafe == "true" ? true : false,
          drawerCheckBox: listItems?.drawer == "true" ? true : false,
          PendingWith: listItems?.pendingWith,
        });
        console.log("Res listItems", listItems);
      });
  }

  public onSubmit = async () => {
    const { context } = this.props;
    const {
      inputFeild,
      doorCheckBox,
      deskCheckBox,
      cabinetCheckBox,
      safeCheckBox,
      drawerCheckBox,
      conditionCheckBox,
      people,
    } = this.state;

    if (conditionCheckBox == false) {
      alert("Please Agree the Terms and Conditions!");
      // } else if (people.length < 1) {
      //   alert("User Name cannot be blank!");
    } else {
      const peopleArr = people.map((person: any) => person.secondaryText);
      const onBehalfEmail = people[0]?.secondaryText;
      let pendingApprover = "";

      if (onBehalfEmail) {
        pendingApprover = onBehalfEmail;
      } else {
        const keyProcessorEmails = await this.getKeyProcessor();
        pendingApprover = keyProcessorEmails[0];
      }
      console.log(pendingApprover, "pendingApprover");
      const headers: any = {
        "X-HTTP-Method": "MERGE",
        "If-Match": "*",
        "Content-Type": "application/json;odata=nometadata",
      };
      const pendingWith = onBehalfEmail ? "On Behalf Of" : "Key Processor";

      const spHttpClintOptions: ISPHttpClientOptions =
        window.location.href.indexOf("?itemID") != -1
          ? {
              headers,
              body: JSON.stringify({
                Title: inputFeild.requestType,
                EmployeeEntity: inputFeild.entity,
                Floor: inputFeild.floor,
                officeNumber: inputFeild.number,
                Door: doorCheckBox.toString(),
                officeDesk: deskCheckBox.toString(),
                cabinet: cabinetCheckBox.toString(),
                officeSafe: safeCheckBox.toString(),
                drawer: drawerCheckBox.toString(),
                DDMenu: inputFeild.DDMenu,
                OnBehalfOfName: JSON.stringify(peopleArr),
                OnBehalfOfEmail: JSON.stringify(onBehalfEmail),
                pendingApprover: JSON.stringify(pendingApprover),
                pendingWith: pendingWith,
              }),
            }
          : {
              body: JSON.stringify({
                Title: inputFeild.requestType,
                EmployeeEntity: inputFeild.entity,
                Floor: inputFeild.floor,
                officeNumber: inputFeild.number,
                Door: doorCheckBox.toString(),
                officeDesk: deskCheckBox.toString(),
                cabinet: cabinetCheckBox.toString(),
                officeSafe: safeCheckBox.toString(),
                drawer: drawerCheckBox.toString(),
                DDMenu: inputFeild.DDMenu,
                OnBehalfOfName: JSON.stringify(peopleArr),
                OnBehalfOfEmail: JSON.stringify(onBehalfEmail),
                pendingApprover: JSON.stringify(pendingApprover),
                pendingWith: pendingWith,
                // OnBehalfOfEmail: JSON.stringify(post.secondaryText),
              }),
            };

      let data = window.location.href.split("=");
      let itemId: any = data[data.length - 1];
      let url =
        window.location.href.indexOf("?itemID") != -1
          ? `/_api/web/lists/GetByTitle('Key-Request')/items('${itemId}')`
          : "/_api/web/lists/GetByTitle('Key-Request')/items";

      context.spHttpClient
        .post(
          `${context.pageContext.web.absoluteUrl}${url}`,
          SPHttpClient.configurations.v1,
          spHttpClintOptions
        )
        .then((res) => {
          console.log("RES POST", res);
          alert(`You have successfully submitted`);
          window.history.go(-1);
        });
    }
  };
  private async getKeyProcessor(): Promise<string[]> {
    const { context } = this.props;
    const url = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Gate-Pass-Approver')/items`;
    try {
      const response = await context.spHttpClient.get(
        url,
        SPHttpClient.configurations.v1
      );
      if (response.ok) {
        const data = await response.json();
        const keyProcessorEmails: string[] = data.value.map(
          (item: any) => item["Key-Processor"]
        );
        return keyProcessorEmails;
      } else {
        console.error(
          "Failed to fetch Key Processor emails:",
          response.statusText
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching Key Processor emails:", error);
      return [];
    }
  }

  public onApproveReject: (Type: string, PendingWith: string) => void = async (
    Type: string,
    PendingWith: string
  ) => {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    const postUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Key-Request')/items('${itemId}')`;
    const headers = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };

    let body: string = JSON.stringify({
      Status: Type,
      pendingWith: PendingWith,
    });
    console.log("body", body);
    const updateInteraction = await postData(context, postUrl, headers, body);
    console.log(updateInteraction);
    window.history.go(-1);
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

  public render(): React.ReactElement<IKeyRequestFormProps> {
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
      entityData,
      checkBox,
      safeCheckBox,
      cabinetCheckBox,
      deskCheckBox,
      doorCheckBox,
      drawerCheckBox,
      conditionCheckBox,
      redirection,
      PendingWith,
    } = this.state;
    const { context } = this.props;
    console.log(inputFeild.doorCheckBox, PendingWith, "doorcheckbox value");
    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Key Request Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Key Request Information
          </div>
          <div
            className="d-flex justify-content-center text-danger py-2 mb-4 headerText"
            style={{ backgroundColor: "#C8CDDB" }}
          >
            Please fill out the fields in * to proceed
          </div>
          <div className="d-flex justify-content-end mb-2">
            <Select
              disabled={redirection}
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
                ? "Key Request Information"
                : "معلومات الطلب الرئيسية"}
            </div>
            <div className="row">
              <InputFeild
                type="select"
                disabled={redirection}
                label={language === "En" ? "Request Type " : "نوع الطلب "}
                name="requestType"
                options={requestTypeData}
                state={inputFeild}
                inputFeild={inputFeild.requestType}
                self={this}
              />
              <InputFeild
                type="select"
                disabled={redirection}
                label={language === "En" ? "Employee Entity " : "كيان الموظف"}
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
                label={language === "En" ? "Floor " : "طابق"}
                name="floor"
                options={["1", "2", "3", "4", "5"]}
                state={inputFeild}
                inputFeild={inputFeild.floor}
                self={this}
              />
              <InputFeild
                type="text"
                disabled={redirection}
                label={
                  language === "En"
                    ? "Requested Office Number "
                    : "رقم المكتب المطلوب"
                }
                name="number"
                state={inputFeild}
                inputFeild={inputFeild.number}
                self={this}
              />
            </div>

            <div className="row mb-2">
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
                    {language === "En" ? "On behalf of" : "باسم"}
                    {/* <span className="text-danger">*</span> */}
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
                    disabled={redirection}
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
                  />
                </div>
              </div>

              {this.state.inputFeild.requestType == "Key Request" && (
                <div className="row">
                  <InputFeild
                    disabled={redirection}
                    type="select"
                    label={language === "En" ? "DD Menu" : "نوع الطلب "}
                    name="DDMenu"
                    options={["New Office", "Lost Key", "Damaged Key"]}
                    state={inputFeild}
                    inputFeild={inputFeild.DDMenu}
                    self={this}
                  />
                </div>
              )}

              <div>
                <div
                  className="mb-3 w-25 p-2"
                  style={{ backgroundColor: "#F0F0F0" }}
                >
                  <label>
                    {language === "En"
                      ? "Specify the Required Keys"
                      : "حدد المفاتيح المطلوبة"}
                  </label>
                </div>

                <div className="d-flex justify-content-start ps-2 mb-2">
                  <input
                    className="form-check"
                    type="checkbox"
                    disabled={redirection}
                    checked={doorCheckBox}
                    defaultChecked={doorCheckBox}
                    onChange={(event) => {
                      this.setState({
                        doorCheckBox: event.target.checked,
                      });
                    }}
                  />
                  <label className={`ps-3`}>
                    {language === "En" ? "Door" : "باب"}
                  </label>
                </div>

                <div className="d-flex justify-content-start ps-2 mb-2">
                  <input
                    className="form-check"
                    type="checkbox"
                    disabled={redirection}
                    checked={deskCheckBox}
                    onChange={(event) => {
                      this.setState({
                        deskCheckBox: event.target.checked,
                      });
                    }}
                  />
                  <label className={`ps-3`}>
                    {language === "En" ? "Office Desk" : "مكتب مكتب"}
                  </label>
                </div>

                <div className="d-flex justify-content-start ps-2 mb-2">
                  <input
                    className="form-check"
                    type="checkBox"
                    disabled={redirection}
                    checked={cabinetCheckBox}
                    onChange={(event) => {
                      this.setState({
                        cabinetCheckBox: event.target.checked,
                      });
                    }}
                  />
                  <label className={`ps-3`}>
                    {language === "En" ? "Office Cabinet" : "مكتب مجلس الوزراء"}
                  </label>
                </div>

                <div className="d-flex justify-content-start ps-2 mb-2">
                  <input
                    className="form-check"
                    type="checkbox"
                    disabled={redirection}
                    checked={safeCheckBox}
                    onChange={(event) => {
                      this.setState({
                        safeCheckBox: event.target.checked,
                      });
                    }}
                  />
                  <label className={`ps-3`}>
                    {language === "En" ? "Office Safe" : "مكتب آمن"}
                  </label>
                </div>

                <div className="d-flex justify-content-start ps-2 mb-2">
                  <input
                    disabled={redirection}
                    className="form-check"
                    type="checkbox"
                    checked={drawerCheckBox}
                    onChange={(event) => {
                      this.setState({
                        drawerCheckBox: event.target.checked,
                      });
                    }}
                  />
                  <label className={`ps-3`}>
                    {language === "En" ? "Drawer" : "جارور"}
                  </label>
                </div>

                <div className="d-flex justify-content-start ps-2 mb-2">
                  <input
                    disabled={redirection}
                    className="form-check"
                    type="checkbox"
                    checked={conditionCheckBox}
                    onChange={(event) => {
                      this.setState({
                        conditionCheckBox: event.target.checked,
                      });
                    }}
                  />
                  <a
                    href="#"
                    onClick={() => this.setState({ isModalOpen: true })}
                  >
                    <label className={`ps-3`}>
                      <a href="#">
                        {language === "En"
                          ? "I agree to Terms & Conditions"
                          : "أوافق على الشروط والأحكام"}
                      </a>
                      <span className="text-danger">*</span>
                    </label>
                  </a>
                </div>
              </div>
              {redirection == false && (
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
              )}
              {(PendingWith === "Key Processor" ||
                PendingWith === "On Behalf Of") && (
                <div className="d-flex justify-content-end mb-2 gap-3">
                  <button
                    className="px-4 py-2 text-white"
                    style={{ backgroundColor: "#223771" }}
                    type="button"
                    onClick={() => {
                      this.onApproveReject("Approved", "Completed");
                    }}
                  >
                    {language === "En" ? "Approve" : "يعتمد"}
                  </button>
                  <button
                    className="px-4 py-2 text-white"
                    style={{ backgroundColor: "#E5E5E5" }}
                    type="button"
                    onClick={() => {
                      this.onApproveReject("Rejected", "Rejected");
                    }}
                  >
                    {language === "En" ? "Reject" : "يرفض"}
                  </button>
                </div>
              )}
            </div>
          </div>
          <Modal
            bodyStyle={{ padding: "25px 50px 25px 50px" }}
            width={750}
            footer={null}
            closable={false}
            visible={this.state.isModalOpen}
          >
            <h4 className="align-items-center">Terms And Conditions</h4>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <div className="campaign_model_footer d-flex justify-content-end align-items-center">
              <button
                className={`me-2 border-0 px-5 text-capitalize`}
                style={{ color: "#808080", height: "40px" }}
                onClick={() =>
                  this.setState({
                    isModalOpen: false,
                    conditionCheckBox: false,
                  })
                }
              >
                Don't agree
              </button>
              <button
                className={`border-0 px-5 text-white text-capitalize`}
                style={{ backgroundColor: "#223771", height: "40px" }}
                onClick={() => {
                  this.setState({
                    isModalOpen: false,
                    conditionCheckBox: true,
                  });
                }}
              >
                Agree
              </button>
            </div>
          </Modal>
        </div>
      </CommunityLayout>
    );
  }
}
