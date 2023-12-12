import * as React from 'react';
import { SPComponentLoader } from "@microsoft/sp-loader";
import CommunityLayout from "../../../common-components/communityLayout/index";
import { Select } from "antd";
import "./index.css";
import InputFeild from "./InputFeild";
import type { IWorkPermitProps } from './IWorkPermitProps';
import RichTextEditor from "../../../common-components/richTextEditor/RichTextEditor";

interface IWorkPermitState {
  inputFeild: any;
  language:any;
  others:any;
  grind:any;
  braze:any;
  weld:any;
  cut:any;
  description:any
}

export default class WorkPermit extends React.Component<
IWorkPermitProps,
IWorkPermitState
> {
  public constructor(props: IWorkPermitProps, state: IWorkPermitState) {
    super(props);
    this.state = {
      inputFeild: {
        name:"",
        date:"",
        number:"",
        commonDate:"",
        area:"",
      },
      language: "En",
      description:"",
      others:false,
      grind:false,
      braze:false,
      weld:false,
      cut:false,

      };
  }

  public render(): React.ReactElement<IWorkPermitProps> {
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
    grind,
    others,
    braze,
    cut,
    weld,
    description
    
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
          Work Permit Information
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
            {language === "En" ? "Work Permit Information" : "معلومات تصريح العمل"}
          </div>

          <div className="row">
          <InputFeild
              type="text"
              label={language === "En" ? "Contractor Name" : "اسم المقاول"}
              name="name"
              state={inputFeild}
              inputFeild={inputFeild.name}
              self={this}
            />

            <InputFeild
              type="datetime-local"
              label={language === "En" ? "Request Date" : "تاريخ الطلب"}
              name="date"
              state={inputFeild}
              inputFeild={inputFeild.date}
              self={this}
            />
          </div>

          <div className="row">
          <InputFeild
              type="text"
              label={language === "En" ? "Contact Number" : "رقم الاتصال"}
              name="number"
              state={inputFeild}
              inputFeild={inputFeild.number}
              self={this}
            />

            <InputFeild
              type="datetime-local"
              label={language === "En" ? "Commoncoment Date" : "تاريخ التوحيد"}
              name="commonDate"
              state={inputFeild}
              inputFeild={inputFeild.commonDate}
              self={this}
            />
          </div>

          <div className="row">
          <InputFeild
              type="text"
              label={language === "En" ? "Area" : "منطقة"}
              name="area"
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
                marginBottom: "8px",
              }}
            >
              <label className="ps-2 py-2" htmlFor="work description">
                {language === "En" ? "Work Description" : "وصف العمل"}
              </label>
            </div>
            <RichTextEditor
              handleSubmit={""}
              handleChange={(content: any) => {
                this.setState({
                  description: content,
                });
              }}
              uploadContent={description}
              placeholder={language === "En" ?"Enter the data":"أدخل البيانات"}
            />
          </div>

          <div
            className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            {language === "En" ? "Hot Work Required" : "العمل الساخن المطلوب"}
          </div>

          <div className="d-flex justify-content-start ps-2 mb-2">
                <input
                  className="form-check"
                  type="checkbox"
                  checked={cut}
                  onChange={(event) => {
                    this.setState({
                      cut: event.target.checked,
                    });
                  }}
                />
                <label className={`ps-3`}>
                  {language === "En" ? "Cut" : "قص"}
                </label>
              </div>

              <div className="d-flex justify-content-start ps-2 mb-2">
                <input
                  className="form-check"
                  type="checkbox"
                  checked={weld}
                  onChange={(event) => {
                    this.setState({
                      weld : event.target.checked,
                    });
                  }}
                />
                <label className={`ps-3`}>
                  {language === "En" ? "Weld" : "لحم"}
                </label>
              </div>

              <div className="d-flex justify-content-start ps-2 mb-2">
                <input
                  className="form-check"
                  type="checkbox"
                  checked={braze}
                  onChange={(event) => {
                    this.setState({
                     braze : event.target.checked,
                    });
                  }}
                />
                <label className={`ps-3`}>
                  {language === "En" ? "Braze" : "بريز"}
                </label>
              </div>

              <div className="d-flex justify-content-start ps-2 mb-2">
                <input
                  className="form-check"
                  type="checkbox"
                  checked={grind}
                  onChange={(event) => {
                    this.setState({
                     grind : event.target.checked,
                    });
                  }}
                />
                <label className={`ps-3`}>
                  {language === "En" ? "Grind" : "طحن"}
                </label>
              </div>

              <div className="d-flex justify-content-start ps-2 mb-2">
                <input
                  className="form-check"
                  type="checkbox"
                  checked={others}
                  onChange={(event) => {
                    this.setState({
                      others : event.target.checked,
                    });
                  }}
                />
                <label className={`ps-3`}>
                  {language === "En" ? "Others" : "الاخرين"}
                </label>
              </div>
              {/* <div
            className="d-flex justify-content-start text-white py-2 mb-4 ps-2 headerText"
            style={{ backgroundColor: "#223771" }}
          >
            {language === "En" ? "Approval Status" : "حالة الموافقة"}
          </div> */}

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
                // this.onSubmit();
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
