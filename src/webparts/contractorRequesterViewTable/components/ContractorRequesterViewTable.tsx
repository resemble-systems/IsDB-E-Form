import * as React from "react";
import styles from "./ContractorRequesterViewTable.module.scss";
import type { IContractorRequesterViewTableProps } from "./IContractorRequesterViewTableProps";
import { Table, Row, Col, Button, Dropdown, DatePicker } from "antd";
import "../components/index.css";
import { navData } from "./navdata";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import HeaderComponent from "../../../common-components/header/HeaderComponent";
import * as XLSX from "xlsx";
import moment from "moment";

interface IContractorRequesterViewTableState {
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
  task: string;
  status: string;
  createdOn: string;
  asignedTo: string;
  dueDate: string;
}
export default class ContractorRequesterViewTable extends React.Component<
  IContractorRequesterViewTableProps,
  IContractorRequesterViewTableState
> {
  public constructor(
    props: IContractorRequesterViewTableProps,
    state: IContractorRequesterViewTableState
  ) {
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
  public columns: any = [
    {
      title: "Req.Id",
      dataIndex: "Id",
    },
    {
      title: "Staff Name",
      dataIndex: "Title",
    },
    {
      title: "Request Type",
      dataIndex: "requestType",
    },
    {
      title: "Request For",
      dataIndex: "CreatedBy",
    },
    {
      title: "ID Type",
      dataIndex: "idType",
    },
    {
      title: "Request date",
      dataIndex: "Created",
      render: (t:any) => <div>{!t ? "" : moment(t).format("DD/MM/YYYY")}</div>,
    },
    {
      title: "Status",
      dataIndex: "Status",
    },
    {
      title: "Pending With",
      dataIndex: "PendingWith",
    },
  ];
  public componentDidMount() {
    console.log("GET Data");
    this.getDetails();
  }
  public getDetails = () => {
    const { context } = this.props;

    context.spHttpClient
      .get(
        `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('Contractor-Form')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        return res.json();
      })
      .then((listItems: any) => {
        console.log("VisitorRequestForm", listItems);

        const sortedItems: any = listItems.value.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        console.log("sortedItems", sortedItems);

        this.setState({
          tableData: sortedItems,
          intialTableData: listItems.value,
        });
      });
  };

  public componentDidUpdate(prevProps: any, prevState: any) {
    const { searchData, intialTableData } = this.state;
    const trimmedSearchData = searchData.trim();

    if (prevState.searchData !== trimmedSearchData) {
      const filteredData = intialTableData.filter(
        (data: any) =>
          data.Title?.toLowerCase().includes(trimmedSearchData?.toLowerCase()) ||
          data.Status?.toLowerCase().includes(
            trimmedSearchData?.toLowerCase()
          ) ||
          data.PendingWith?.toLowerCase().includes(
            trimmedSearchData?.toLowerCase()
          ) ||
          data.idType?.toLowerCase().includes(
            trimmedSearchData?.toLowerCase()
          ) ||
          data.requestType?.toLowerCase().includes(
            trimmedSearchData?.toLowerCase()
          ) ||
          data.CreatedBy?.toLowerCase().includes(
            trimmedSearchData?.toLowerCase()
          ) ||
          moment(data.Created).format("DD/MM/YYYY, h:mm:ss")?.toLowerCase().includes(trimmedSearchData?.toLowerCase()) ||
          data.Id?.toString().toLowerCase().includes(trimmedSearchData?.toLowerCase())
      );
      this.setState({
        tableData: filteredData,
        searchData: trimmedSearchData,
      });
    }
  }

  public downloadExcel = (data: any) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "DataSheet.xlsx");
    console.log(worksheet, workbook, data, "workbook all data");
  };
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
  public render(): React.ReactElement<IContractorRequesterViewTableProps> {
    const { tableData, activeNav, filterStartDate, endDateError } = this.state;
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
                  onClick={() => {
                    if (data.Title === "Home") {
                      this.getDetails();
                    }
                    this.setState({
                      activeNav: data.Title,
                    });
                  }}
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
                currentPageTitle={"Contractor/Trainee Request Requester View Table"}
                context={context}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center px-4 mb-3 pt-2">
              <div
                className="d-flex gap-3 align-items-center"
                style={{ fontSize: "1.125em", fontWeight: 600 }}
              >
                <button
                  className="px-3 py-2 text-white"
                  style={{ backgroundColor: "#3B9642" }}
                  onClick={() => {
                    window.location.href = `${this.props.context.pageContext.site.absoluteUrl}/SitePages/contract-form.aspx`;
                  }}
                >
                  <span className="pe-1" style={{ fontWeight: 700 }}>
                    <i className="fas fa-plus me-1"></i>
                  </span>
                  New
                </button>
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

                <span style={{ cursor: "pointer" }}>View Audit Log</span>
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
              <div className="visitorHeading">
                Contractor/ Trainee Requests (Requester view)
              </div>
            </div>

            <div className="px-4">
              <Table
                columns={this.columns}
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
