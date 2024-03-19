import * as React from "react";
import styles from "./SsimsDashboard.module.scss";
import moment from "moment";
import "../components/index.css";
import type { ColumnsType } from "antd/es/table";
import { navData } from "./navdata";
import * as XLSX from "xlsx";
import HeaderComponent from "../../../common-components/header/HeaderComponent";
import { Col, Row, Table, Button, DatePicker, Dropdown, Space } from "antd";
import type { ISsimsDashboardProps } from "./ISsimsDashboardProps";
import { SPHttpClient } from "@microsoft/sp-http";
// import { escape } from '@microsoft/sp-lodash-subset';

interface ISsimsDashboardState {
  searchData: string;
  tableData: DataType[];
  activeNav: string;
  intialTableData: any;
  filterStartDate: any;
  filterEndDate: any;
  endDateError: any;
  tableDummyData: any;
}
interface DataType {
  key: React.Key;
  // task: string;
  // status: string;
  // createdOn: string;
  // asignedTo: string;
  // dueDate: string;
}
export default class SsimsDashboard extends React.Component<
  ISsimsDashboardProps,
  ISsimsDashboardState
> {
  public constructor(props: ISsimsDashboardProps, state: ISsimsDashboardState) {
    super(props);
    this.state = {
      searchData: "",
      activeNav: "Home",
      tableData: [],
      intialTableData: [],
      filterStartDate: null,
      filterEndDate: null,
      endDateError: false,
      tableDummyData: [],
    };
  }
  public columns: ColumnsType<DataType> = [
    {
      title: "Count",
      dataIndex: "key",
    },
    {
      title: "Task Name",
      dataIndex: "Title",
    },

    {
      title: "Request By",
      dataIndex: "CreatedBy",
    },

    {
      title: "Request date",
      dataIndex: "Created",
      render: (t: any) => <div>{!t ? "" : moment(t).format("DD/MM/YYYY")}</div>,
    },
    {
      title: "Status",
      dataIndex: "Status",
    },
    {
      title: "Action",
      dataIndex: ["Id", "View"],
      key: "operation",
      width: 220,
      render: (t: any, r: any, i: any) => {
        let viewLink = "";
        if (r.listType === "VisitorRequestForm") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/visit-request-form-employee.aspx?itemID=${r[
            "Id"
          ].toString()}`;
        } else if (r.listType === "Contractor-Form") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/contractor-form.aspx?itemID=${r["Id"].toString()}`;
        } else if (r.listType === "Parking-Request") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/parking-request-form.aspx?itemID=${r["Id"].toString()}`;
        } else if (r.listType === "Key-Request") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/key-request-form.aspx?itemID=${r["Id"].toString()}`;
        } else if (r.listType === "DataCenterAccess") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/data-center-form.aspx?itemID=${r["Id"].toString()}`;
        } else if (r.listType === "Employee-Reprimand") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/employee-reprimand.aspx?itemID=${r["Id"].toString()}`;
        } else if (r.listType === "Gate-Pass") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/Gate-Pass-Request-form.aspx?itemID=${r["Id"].toString()}`;
        } else if (r.listType === "Safety-Incident") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/Safety-Incident-Form.aspx?itemID=${r["Id"].toString()}`;
        } else if (r.listType === "Shift-Report") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/shift-report-form.aspx?itemID=${r["Id"].toString()}`;
        } else if (r.listType === "BlackList") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/black-list-form.aspx?itemID=${r["Id"].toString()}`;
        } else if (r.listType === "Work-Permit") {
          viewLink = `${
            this.props.context.pageContext.site.absoluteUrl
          }/SitePages/work-permit.aspx?itemID=${r["Id"].toString()}`;
        }
        return (
          <Space size="middle">
            <a
              className={`${styles.departmentManageEventAction} mx-2`}
              href={viewLink}
              target="_blank"
            >
              View
            </a>
          </Space>
        );
      },
    },
    // {
    //   title: "Action",
    //   dataIndex: ["Id", "View"],
    //   key: "operation",
    //   width: 220,
    //   render: (t: any, r: any, i: any) => (

    //     <Space size="middle">
    //       <a
    //         className={`${styles.departmentManageEventAction} mx-2`}
    //         onClick={() => {
    //           window.location.href = `${
    //             this.props.context.pageContext.site.absoluteUrl
    //           }/SitePages/visit-request-printout.aspx?itemID=${r[
    //             "Id"
    //           ].toString()}`;
    //         }}
    //       >
    //         View
    //       </a>
    //     </Space>
    //   ),
    // },
  ];

  public downloadExcel = (data: any) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "DataSheet.xlsx");
    console.log(worksheet, workbook, data, "workbook all data");
  };
  public componentDidMount() {
    console.log("GET Data");
    this.getData();
  }
  public async getData() {
    const { context } = this.props;
    //const { tableData } = this.state;

    let VisitorRequestFormRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('VisitorRequestForm')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let VisitorRequestForm = await VisitorRequestFormRes.json();

    let contractorRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Contractor-Form')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let contractorForm = await contractorRes.json();

    let ParkingRequestRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Parking-Request')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let ParkingRequest = await ParkingRequestRes.json();

    let KeyRequestRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Key-Request')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let KeyRequest = await KeyRequestRes.json();

    let DataCenterAccessRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('DataCenterAccess')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let DataCenterAccess = await DataCenterAccessRes.json();

    let EmployeeReprimandRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Employee-Reprimand')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let EmployeeReprimand = await EmployeeReprimandRes.json();

    let GatePassRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Gate-Pass')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let GatePass = await GatePassRes.json();
    let SafetyIncidentRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Safety-Incident')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let SafetyIncident = await SafetyIncidentRes.json();

    let ShiftReportRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Shift-Report')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let ShiftReport = await ShiftReportRes.json();

    let BlackListRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('BlackList')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let BlackList = await BlackListRes.json();

    let WorkPermitRes = await context.spHttpClient.get(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Work-Permit')/items?$select=&$expand=AttachmentFiles`,
      SPHttpClient.configurations.v1
    );
    let WorkPermit = await WorkPermitRes.json();
    let tableListData = [
      ...VisitorRequestForm.value,
      ...contractorForm.value,
      ...ParkingRequest.value,
      ...KeyRequest.value,
      ...DataCenterAccess.value,
      ...EmployeeReprimand.value,
      ...GatePass.value,
      ...SafetyIncident.value,
      ...ShiftReport.value,
      ...BlackList.value,
      ...WorkPermit.value,
    ];
    const filteredItems = tableListData.filter(
      (item: any) =>
        item.PendingWith === "Receptionist" ||
        item.PendingWith === "FMSDC (Approver)" ||
        item.PendingWith === "Contract Admin Manager" ||
        item.PendingWith === "HR Training and Development Division" ||
        item.PendingWith === "Immediate Supervisor" ||
        item.PendingWith === "Employee" ||
        item.PendingWith === "System" ||
        item.PendingWith === "ManagSecurity Manager" ||
        item.PendingWith === "Head of Safety and Security" ||
        item.PendingWith === "SSIMS Reviewer" ||
        item.PendingWith === "SSIMS Manager" ||
        item.PendingWith === "Data Center Owner" ||
        item.pendingWith === "Key Processor"
    );

    let tableSortedData = filteredItems.sort(
      (a: any, b: any) =>
        new Date(b.Created).getTime() - new Date(a.Created).getTime()
    );

    this.setState({
      tableData: tableSortedData,
      intialTableData: tableListData,
    });
  }

  public onSubmit = () => {
    const {
      intialTableData,

      filterStartDate,
      filterEndDate,
      endDateError,
    } = this.state;
    let filteredData: any = null;
    if (endDateError) {
      alert("End Date must be greater than or equal to Start Date");
    } else {
      filteredData = intialTableData?.filter((filterData: any) => {
        if (filterStartDate?.$d && filterEndDate?.$d)
          return (
            new Date(filterData.Created).getTime() >
              new Date(filterStartDate.$d).setHours(0, 0, 0, 0) &&
            new Date(filterData.Created).getTime() <
              new Date(filterEndDate.$d).setHours(23, 59, 59, 999)
          );
        else if (filterStartDate?.$d)
          return (
            new Date(filterData.Created).getTime() >
            new Date(filterStartDate.$d).setHours(0, 0, 0, 0)
          );
        else if (filterEndDate?.$d)
          return (
            new Date(filterData.Created).getTime() <
            new Date(filterEndDate.$d).setHours(23, 59, 59, 999)
          );
        else return filterData;
      });
      console.log(filteredData, "filterdatassss");
      console.log(
        "filterStartDateAfter, filterEndDateAfter",
        filterStartDate,
        filterEndDate
      );

      this.setState({
        tableData: filteredData,
      });
    }
  };
  public render(): React.ReactElement<ISsimsDashboardProps> {
    const { tableData, activeNav, endDateError, filterStartDate } = this.state;
    const { context } = this.props;

    return (
      <Row>
        <Col xs={0} sm={0} md={4} lg={4} xl={4}>
          <div className="d-flex">
            <div
              className="d-none d-lg-block d-xl-block"
              style={{
                borderRight: "solid 2px #E3E3E3",
                height: "100vh",
                width: "100%",
              }}
            >
              {navData.map((data) => (
                <div
                  className="d-flex justify-content-start px-2 py-3"
                  style={{
                    borderLeft: `${
                      activeNav === data.Title ? "10px solid #24396F" : "none"
                    }`,
                    backgroundColor: `${
                      activeNav === data.Title ? "#DEE8F2" : "#fff"
                    }`,

                    cursor: "pointer",
                    fontSize: "1.125em",
                    fontWeight: 700,
                  }}
                  // onClick={() => {
                  //   if (data.Title === "Blacklisted Visitor") {
                  //     this.getDetails();
                  //   } else if (
                  //     data.Title === "Home" ||
                  //     data.Title === "My Tasks"
                  //   ) {
                  //     this.getData();
                  //   }
                  //   this.setState({
                  //     activeNav: data.Title,
                  //   });
                  // }}
                >
                  {data.Title}
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={0} sm={0} md={4} lg={20} xl={20}>
          <div className="pb-5">
            <div className="">
              <HeaderComponent
                currentPageTitle={"Manager Dashboard"}
                context={context}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center px-4 mb-3 pt-2">
              <div
                className="d-flex gap-3 align-items-center"
                style={{ fontSize: "1.125em", fontWeight: 600 }}
              >
                {/* <button
                className="px-3 py-2 text-white"
                style={{ backgroundColor: "#3B9642" }}
                onClick={() => {
                  window.location.href = `${this.props.context.pageContext.site.absoluteUrl}/SitePages/visit-request-form-employee.aspx`;
                }}
              >
                <span className="pe-1" style={{ fontWeight: 700 }}>
                  <i className="fas fa-plus me-1"></i>
                </span>
                New
              </button> */}
                <Button
                  className="rounded bg-light text-dark"
                  style={{
                    fontSize: "1.125em",
                    fontWeight: 600,
                    height: "40px",
                  }}
                  type="text"
                  onClick={() => this.downloadExcel(tableData)}
                >
                  <i
                    className="fas fa-file-excel"
                    style={{ color: "#20701a" }}
                  ></i>
                  &nbsp; Export
                </Button>
                {/* <span style={{ cursor: "pointer" }}>View Audit Log</span> */}
              </div>
              <div className="d-flex align-items-center">
                <input
                  className={`${styles.departmentManageSearchItem} px-2`}
                  type="text"
                  placeholder="Search"
                  onChange={(e) =>
                    this.setState({ searchData: e.target.value })
                  }
                />
                <i
                  className={`fas fa-search px-2 d-flex justify-content-center align-items-center ${styles.departmentManageSearchIcon}`}
                ></i>

                <div className="d-flex  align-items-center justify-content-end">
                  <Dropdown
                    trigger={["click"]}
                    overlay={
                      <div
                        className={`bg-light shadow`}
                        style={{ width: "350px" }}
                      >
                        <div
                          className={`p-4 border-bottom border-2 ${styles.newsFilterCardTitle}`}
                        >
                          Filter
                        </div>
                        <div className="px-3">
                          <div className={`${styles.newsFilterLable}`}>
                            Select Date
                          </div>
                          <DatePicker
                            placeholder="Start Date"
                            placement={"bottomLeft"}
                            format={"DD-MM-YYYY"}
                            className={`w-100 my-2 border border-2 ${styles.newsFilterDatePicker}`}
                            onChange={(dateString) => {
                              console.log("dateString", dateString);
                              this.setState({
                                filterStartDate: dateString,
                              });
                            }}
                          />
                          <DatePicker
                            placeholder="End Date"
                            placement={"bottomLeft"}
                            format={"DD-MM-YYYY"}
                            className={`w-100 my-2 border border-2 ${
                              styles.newsFilterDatePicker
                            } ${endDateError && "border-danger"}`}
                            onChange={(dateString) => {
                              let temp: any = dateString;
                              if (
                                filterStartDate.$d.getTime() < temp.$d.getTime()
                              )
                                this.setState({
                                  filterEndDate: dateString,
                                  endDateError: false,
                                });
                              else {
                                this.setState({ endDateError: true });
                                alert(
                                  "End Date must be greater than or equal to Start Date"
                                );
                              }
                            }}
                          />
                          <button
                            className={`w-100 mt-2 mb-4 ${styles.newsFilterSubmitBtn}`}
                            onClick={this.onSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    }
                  >
                    <div className="d-flex justify-content-center align-items-center px-2 ms-2">
                      <button
                        className={`${styles.departmentManageFilter} p-1`}
                      >
                        <img
                          className={`${styles.departmentManageFilterImg} p-1`}
                          src={require("../assets/Filter.svg")}
                        />
                      </button>
                    </div>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center p-3 px-4">
              <div className="visitorHeading">Manager Dashboard</div>
            </div>
            <div className="px-4">
              <Table
                // columns={
                //   activeNav === "Home" || activeNav == "My Tasks"
                //     ? this.columns
                //     : this.columnsBlackList
                // }
                dataSource={tableData}
                size="middle"
                pagination={{
                  pageSize: 10,
                }}
                scroll={{ y: 300 }}
              />
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}
