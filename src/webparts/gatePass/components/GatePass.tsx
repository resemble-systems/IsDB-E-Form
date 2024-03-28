import * as React from "react";
import type { IGatePassProps } from "./IGatePassProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Input, InputNumber, Popconfirm, Select, Table, Modal } from "antd";
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

interface IGatePassState {
  inputFeild: any;
  language: any;
  requestTypeData: any;
  // entityData: any;
  checkBox: any;
  people: any;
  peopleData: any;
  conditionCheckBox: any;
  alreadyExist: any;
  tableData: any;
  paginationData: any;
  redirection: boolean;
  Column: any;
  showAdd: boolean;
  addDetails: any;
  nameOptions: Array<{ value: string; label: string; email: string }>;
  nameSelected: any;
  isModalOpen: any;
  PendingWith: any;
  QuantityPost: any;
  DescriptionPost: any;
  SerialPost: any;
  ModelPost: any;
}

export default class GatePass extends React.Component<
  IGatePassProps,
  IGatePassState
> {
  public constructor(props: IGatePassProps, state: IGatePassState) {
    super(props);
    this.state = {
      inputFeild: {
        requestType: "Repair",
        // entity: "Entity - 1",
      },
      language: "En",
      requestTypeData: [],
      // entityData: [],
      checkBox: false,
      people: [],
      peopleData: [],
      redirection: false,
      conditionCheckBox: false,
      alreadyExist: "",
      tableData: [],
      paginationData: {
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
      Column: [],
      nameOptions: [],
      nameSelected: [],
      showAdd: false,
      addDetails: { Model: "", Serial: "", Description: "", Quantity: 0 },
      isModalOpen: false,
      PendingWith: "on behalf of",
      QuantityPost: "",
      DescriptionPost: "",
      SerialPost: "",
      ModelPost: "",
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
    this.getDetails();
    if (window.location.href.indexOf("?#viewitemID") != -1) {
      this.getAdmin(itemId);
    }
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
  }
  //   context.spHttpClient
  //     .get(
  //       `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Visited-Entity')/items`,
  //       SPHttpClient.configurations.v1
  //     )
  //     .then((res: SPHttpClientResponse) => {
  //       return res.json();
  //     })
  //     .then((listItems: any) => {
  //       let filterData = listItems.value?.map((data: any) => {
  //         return data.Title;
  //       });
  //       this.setState({
  //         entityData: filterData,
  //       });
  //       console.log("filterData", filterData);
  //     });
  // }

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
  /*  public componentDidUpdate(
    prevProps: Readonly<IGatePassProps>,
    prevState: Readonly<IGatePassState>
  ): void {
    if (prevState.tableData !== this.state.tableData) {
      this.setState({ addDetails: {} });
    }
  } */

  public getAdmin(itemId: any) {
    const { context } = this.props;
    const { inputFeild } = this.state;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Gate_Pass')/items('${itemId}')?$select=&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Res listItems", listItems);
        const TableData = listItems?.TableData
          ? JSON.parse(listItems?.TableData)
          : [];
        const PeopleData = listItems?.OnBehalfOfEmail
          ? JSON.parse(listItems?.OnBehalfOfEmail)
          : [];
        console.log("JSON DATA", TableData, PeopleData);
        const extractedEmail = listItems?.OnBehalfOfEmail
          ? listItems.OnBehalfOfEmail.replace(/^"(.*)"$/, "$1")
          : "";
        console.log("extractedEmail", extractedEmail);

        this.setState({
          inputFeild: {
            ...inputFeild,
            requestType: listItems?.Title,
            entity: listItems?.VisitedEntity,
            OnBehalfOfEmail: extractedEmail,
            name: listItems?.Name,
            extension: listItems?.Extension,
            Department: listItems?.Department,
            position: listItems?.Position,
            QuantityPost: listItems?.Quantity,
            ModelPost: listItems?.Model,
            SerialPost: listItems?.SerialNumber,
            DescriptionPost: listItems?.Description,
          },
          PendingWith: listItems?.pendingWith,
          tableData: TableData,
          people: PeopleData,
          checkBox: listItems?.CheckBox,
        });
      });
  }

  public onSubmit = async () => {
    const { context } = this.props;
    const {
      inputFeild,
      conditionCheckBox,
      people,
      tableData,
      checkBox,
      PendingWith,
    } = this.state;

    if (conditionCheckBox == false) {
      alert("Please Agree the Terms and Conditions!");
    } else if (checkBox && tableData?.length < 1) {
      alert("Equipments data cannot be blank!");
    } else if (people.length < 1) {
      alert("on behalf of cannot be blank!");
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
          window.location.href.indexOf("?itemID") != -1
            ? {
                headers,
                body: JSON.stringify({
                  Name: inputFeild.name,
                  Extension: inputFeild.extension,
                  Department: inputFeild.Department,
                  Position: inputFeild.position,
                  Title: inputFeild.requestType,
                  VisitedEntity: inputFeild.entity,
                  QuantityPost: inputFeild.QuantityPost,
                  DescriptionPost: inputFeild.DescriptionPost,
                  SerialPost: inputFeild.SerialPost,
                  ModelPost: inputFeild.ModelPost,
                  CheckBox: checkBox.toString(),
                  TableData: JSON.stringify(tableData),
                  OnBehalfOfName: JSON.stringify(peopleArr),
                  OnBehalfOfEmail: JSON.stringify(post.secondaryText),
                  pendingWith: PendingWith,
                }),
              }
            : {
                body: JSON.stringify({
                  Name: inputFeild.name,
                  Extension: inputFeild.extension,
                  Department: inputFeild.Department,
                  Position: inputFeild.position,
                  Title: inputFeild.requestType,
                  VisitedEntity: inputFeild.entity,
                  QuantityPost: inputFeild.QuantityPost,
                  DescriptionPost: inputFeild.DescriptionPost,
                  SerialPost: inputFeild.SerialPost,
                  ModelPost: inputFeild.ModelPost,
                  CheckBox: checkBox.toString(),
                  TableData: JSON.stringify(tableData),
                  OnBehalfOfName: JSON.stringify(peopleArr),
                  OnBehalfOfEmail: JSON.stringify(post.secondaryText),
                  pendingWith: PendingWith,
                }),
              };

        let data = window.location.href.split("=");
        let itemId = data[data.length - 1];

        let url =
          window.location.href.indexOf("?itemID") != -1
            ? `/_api/web/lists/GetByTitle('Gate_Pass')/items('${itemId}')`
            : "/_api/web/lists/GetByTitle('Gate_Pass')/items";

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
      });
    }
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

            console.log("Selected User Details", user);

            this.setState({
              inputFeild: {
                ...InputFeild,
                name: user.displayName,
                Department: user.department,
                // officeNumber: user.mobilePhone,
                // mobileNumber: user.mobilePhone,
                // officeLocation: user.officeLocation,
              },
            });
          });
      });
  }
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
  public onApproveReject: (Type: string, PendingWith: string) => void = async (
    Type: string,
    PendingWith: string
  ) => {
    const { context } = this.props;
    let data = window.location.href.split("=");
    let itemId = data[data.length - 1];
    const postUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Gate_Pass')/items('${itemId}')`;
    const headers = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };

    let body: string = JSON.stringify({
      status: Type,
      pendingWith: PendingWith,
    });

    const updateInteraction = await postData(context, postUrl, headers, body);
    console.log(updateInteraction);
    if (updateInteraction) {
      this.setState({ PendingWith: PendingWith }, () => {
        alert("The form has been successfully " + Type + "!");
        window.history.go(-1);
      });
    }
    console.log("pendingwithonapproval",this.state.PendingWith)
  };

  public render(): React.ReactElement<IGatePassProps> {
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
      // entityData,
      checkBox,
      conditionCheckBox,
      tableData,
      showAdd,
      addDetails,
      PendingWith,
      redirection,
      ModelPost,
      SerialPost,
      DescriptionPost,
      QuantityPost,
    } = this.state;
    const { context } = this.props;
    console.log(PendingWith, "PendingWith");
    // const handleSearch = (newValue: string) => {
    //   let nameSearch = newValue;
    //   console.log("nameSearch", nameSearch);
    //   if (nameSearch.length >= 3) {
    //     this.getNames(nameSearch);
    //   }
    // };

    const columns = [
      {
        title: `Model`,
        dataIndex: `Model`,
      },
      {
        title: "Serial",
        dataIndex: "Serial",
      },
      {
        title: "Description",
        dataIndex: "Description",
      },
      {
        title: "Quantity",
        dataIndex: "Quantity",
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (_: any, record: { key: number }) =>
          tableData.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a className="text-primary">Remove</a>
            </Popconfirm>
          ) : null,
      },
    ];

    const handleDelete = (key: number) => {
      const newData = tableData?.filter(
        (item: { key: number }) => item.key !== key
      );
      this.setState({ tableData: newData });
    };

    const handleChange = (event: {
      target: { name: string; value: string };
    }) => {
      this.setState({
        addDetails: { ...addDetails, [event.target.name]: event.target.value },
      });
    };

    return (
      <CommunityLayout
        self={this}
        context={context}
        searchShow={false}
        selectedTitle="Gate Pass Form"
      >
        <div className="container py-4 mb-5 bg-white shadow-lg">
          <div
            className="d-flex justify-content-center text-white py-2 mb-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            Gate Pass Information
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
                disabled={redirection}
                type="text"
                label={language === "En" ? "Name" : "اسم الموظفين"}
                name="name"
                state={inputFeild}
                inputFeild={inputFeild.name}
              />
              <InputFeild
                type="text"
                disabled={redirection}
                label={language === "En" ? "Position" : "المسمى الوظيفي"}
                name="position"
                state={inputFeild}
                inputFeild={inputFeild.position}
                self={this}
              />
            </div>
            <div className="row">
              <InputFeild
                type="text"
                disabled={redirection}
                label={language === "En" ? "Extension" : "رقم الهوية"}
                name="extension"
                state={inputFeild}
                inputFeild={inputFeild.extension}
                self={this}
              />
              <InputFeild
                type="text"
                disabled={redirection}
                label={language === "En" ? "Department" : "قسم"}
                name="Department"
                state={inputFeild}
                inputFeild={inputFeild.Department}
                self={this}
              />
            </div>
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En"
                ? "On Behalf Of Information"
                : "نيابة عن المعلومات"}
            </div>
            <div className="row mb-2">
              {!redirection ? (
                <div className="d-flex py-2">
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
                      {language === "En" ? "On Behalf Of" : "نيابة عن"}
                      <span className="text-danger">*</span>
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
            <div
              className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
              style={{ backgroundColor: "#223771" }}
            >
              {language === "En" ? "Request Information" : "طلب معلومات"}
            </div>
            <div className="row">
              <InputFeild
                disabled={redirection}
                type="select"
                label={
                  language === "En"
                    ? "Reason To Take Goods"
                    : "ريسون لأخذ البضائع"
                }
                name="requestType"
                options={requestTypeData}
                state={inputFeild}
                inputFeild={inputFeild.requestType}
                self={this}
              />
              {/* <InputFeild
                disabled={redirection}
                type="select"
                label={language === "En" ? "Original Entity " : "الكيان الأصلي"}
                name="entity"
                options={entityData}
                state={inputFeild}
                inputFeild={inputFeild.entity}
                self={this}
              /> */}
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
                  {" "}
                  <label className="ps-2 py-2" htmlFor="onBehalfOf">
                    {language === "En"
                      ? "IT Related Equipments"
                      : "المعدات المتعلقة بتكنولوجيا المعلومات"}
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
                <div className="my-2">
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    size="middle"
                    className="mb-2"
                    pagination={this.state.paginationData}
                    scroll={{ y: 300 }}
                  />
                  {showAdd && (
                    <div className="d-flex gap-3 mb-2">
                      <Input
                        required
                        name="Model"
                        placeholder="Please enter Model"
                        onChange={handleChange}
                      />
                      <Input
                        required
                        name="Serial"
                        placeholder="Please enter Serial"
                        onChange={handleChange}
                      />
                      <Input
                        required
                        name="Description"
                        placeholder="Please enter Description"
                        onChange={handleChange}
                      />
                      <InputNumber
                        style={{ width: "100%" }}
                        required
                        name="Quantity"
                        placeholder="Please enter Quantity"
                        min={0}
                        onChange={(value: number) => {
                          this.setState({
                            addDetails: { ...addDetails, Quantity: value },
                          });
                        }}
                      />
                      <button
                        className="px-4 py-2 text-white"
                        style={{ backgroundColor: "#223771" }}
                        type="button"
                        onClick={() => {
                          const { Model, Description, Serial, Quantity } =
                            addDetails;
                          if (Model?.length < 3) alert("Enter valid Model");
                          else if (Description?.length < 3)
                            alert("Enter valid Description");
                          else if (Serial?.length < 3)
                            alert("Enter valid Serial");
                          else if (Quantity == 0) alert("Enter valid Quantity");
                          else {
                            this.setState({ showAdd: false });
                            const getTableContent = (tableContent: any) => {
                              console.log("tableContent", tableContent);
                              const tableData = tableContent?.map(
                                (data: {
                                  key: any;
                                  Model: any;
                                  Description: any;
                                  Serial: any;
                                  Quantity: any;
                                }) => ({
                                  key: data.key,
                                  Model: data.Model,
                                  Description: data.Description,
                                  Serial: data.Serial,
                                  Quantity: data.Quantity,
                                })
                              );
                              this.setState({ addDetails: {} });
                              return tableData;
                            };
                            this.setState({
                              tableData: getTableContent([
                                ...tableData,
                                { ...addDetails, key: tableData?.length + 1 },
                              ]),
                            });
                          }
                        }}
                      >
                        {language === "En" ? "Add" : "جمع"}
                      </button>
                    </div>
                  )}

                  <div className="d-flex justify-content-end">
                    <button
                      className="px-4 py-2 text-white"
                      style={{ backgroundColor: "#223771" }}
                      type="button"
                      onClick={() => {
                        this.setState({ showAdd: true });
                      }}
                    >
                      {language === "En" ? "Add New" : "إضافة جديد"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {!checkBox && (
              <div>
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
                    <label className="ps-2 py-2" htmlFor="quantity">
                      {language === "En" ? "Quantity" : "الكمية"}
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
                    value={QuantityPost}
                    onChange={(e) =>
                      this.setState({ QuantityPost: e.target.value })
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
                    <label className="ps-2 py-2" htmlFor="description">
                      {language === "En" ? "Description" : "الكمية"}
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
                    value={DescriptionPost}
                    onChange={(e) =>
                      this.setState({ DescriptionPost: e.target.value })
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
                    <label className="ps-2 py-2" htmlFor="model">
                      {language === "En" ? "Model" : "الموديل"}
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
                    value={ModelPost}
                    onChange={(e) =>
                      this.setState({ ModelPost: e.target.value })
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
                    <label className="ps-2 py-2" htmlFor="serial">
                      {language === "En" ? "Serial" : "الرقم التسلسلي"}
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
                    value={SerialPost}
                    onChange={(e) =>
                      this.setState({ SerialPost: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

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
                <a
                  href="#"
                  onClick={() => this.setState({ isModalOpen: true })}
                >
                  {" "}
                  {language === "En"
                    ? "I agree to Terms & Conditions"
                    : "أوافق على الشروط والأحكام"}
                </a>
                <span className="text-danger">*</span>
              </label>
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
            {(PendingWith === "SSIMS Manager" ||
              PendingWith === "on behalf of") &&
              redirection == true && (
                <div className="d-flex justify-content-end mb-2 gap-3">
                  <button
                    className="px-4 py-2 text-white"
                    style={{ backgroundColor: "#223771" }}
                    type="button"
                    onClick={() => {
                      const { PendingWith } = this.state;

                      console.log(PendingWith, "PendingWithbtn");
                      if (PendingWith === "on behalf of") {
                        this.onApproveReject("Approve", "SSIMS Manager");
                      } else if (PendingWith === "SSIMS Manager") {
                        this.onApproveReject("Approve", "Completed");
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
                      const { PendingWith } = this.state;
                      console.log(PendingWith, "PendingWith");

                      if (PendingWith === "on behalf of") {
                        this.onApproveReject("Reject", "Rejected by Approver");
                      } else if (PendingWith === "SSIMS Manager") {
                        this.onApproveReject("Reject", "Rejected by Manager");
                      }
                    }}
                  >
                    {language === "En" ? "Reject" : "يرفض"}
                  </button>
                </div>
              )}
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
          </form>
        </div>
      </CommunityLayout>
    );
  }
}
