import * as React from "react";
import "./index.css";

interface IInputFeildProps {
  label: any;
  inputFeild?: any;
  type: string;
  disabled?: boolean;
  name: string;
  state: any;
  self: any;
  options?: any;
  fileData?: any;
  handleFileChange?: any;
  autoComplete: any;
}

export default class InputFeild extends React.Component<IInputFeildProps, {}> {
  static staffName: any;
  public render(): React.ReactElement<IInputFeildProps> {
    const {
      label,
      inputFeild,
      type,
      name,
      state,
      disabled,
      autoComplete,
      self,
      options,

      handleFileChange,
    } = this.props;

    const handleChange = (event: { target: { name: any; value: any } }) => {
      const regex = /^\s+/;
      if (regex.test(event.target.value)) {
        self.setState({ inputFeild: { ...state, [event.target.name]: "" } });
        alert("Enter valid String");
      } else {
        self.setState({
          inputFeild: { ...state, [event.target.name]: event.target.value },
        });
      }
    };

    return (
      <div
        className={`d-flex col-lg-6 col-md-6 col-sm-12 mb-2 ${
          type === "file" ? "align-items-center" : " "
        }`}
      >
        <label
          className={`ps-2 py-${type === "textArea" ? "5" : "2"} ${
            type === "file" ? "w-100" : "w-50"
          } d-flex align-items-center`}
          htmlFor={label}
          style={{ backgroundColor: "#F0F0F0" }}
        >
          {label}
          {/* <span className="text-danger ms-2">*</span> */}
        </label>

        {type === "datetime-local" || type === "text" ? (
          <input
            className="w-50 ps-3"
            type={type}
            id={label}
            name={name}
            value={inputFeild}
            onChange={handleChange}
            disabled={disabled}
            autoComplete={autoComplete}
            style={{
              color:
                type === "datetime-local" && inputFeild === ""
                  ? "transparent"
                  : "inherit",
            }}
          />
        ) : type === "select" ? (
          <select
            className="w-50 ps-2"
            id={label}
            name={name}
            style={{
              border: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onChange={handleChange}
          >
            {options?.map(
              (
                data: string | number | readonly string[] | undefined,
                index: React.Key | null | undefined
              ) => (
                <option value={data} key={index}>
                  {data}
                </option>
              )
            )}
          </select>
        ) : type === "textArea" ? (
          <textarea
            id={label}
            disabled={disabled}
            name={name}
            // dangerouslySetInnerHTML={innerhtml}
            value={inputFeild}
            onChange={handleChange}
            // required
            className="w-50 ps-3"
          />
        ) : type === "file" ? (
          <input
            className="w-100 ps-2"
            type={type}
            id={label}
            name={name}
            disabled={disabled}
            multiple={false}
            /* value={fileData} */
            onChange={handleFileChange}
            style={{ color: "transparent", cursor: "pointer" }}
          />
        ) : type === "radio" ? (
          <div className="d-flex gap-5 ps-3">
            <div className="d-flex gap-1 align-items-center">
              <input
                className=""
                type={type}
                id={"Yes"}
                name={name}
                disabled={disabled}
                value={inputFeild}
                onClick={() => {
                  self.setState({
                    inputFeild: { ...state, visitorNotify: "Yes" },
                  });
                }}
              />
              <label htmlFor="Yes">Yes</label>
            </div>
            <div className="d-flex gap-1  align-items-center">
              <input
                className=""
                type={type}
                id={"No"}
                name={name}
                value={inputFeild}
                disabled={disabled}
                onClick={() => {
                  self.setState({
                    inputFeild: { ...state, visitorNotify: "No" },
                  });
                }}
              />
              <label htmlFor="No">No</label>
            </div>
          </div>
        ) : type === "customradio" ? (
          <div className="d-flex gap-5 ps-3">
            <div className="d-flex gap-1 align-items-center">
              <input
                className=""
                type={"radio"}
                id={"BuisnessVisit"}
                name={name}
                value={inputFeild}
                disabled={disabled}
                checked
                onClick={() => {
                  self.setState({
                    inputFeild: {
                      ...state,
                      visitorPurposeOfVisit: "BuisnessVisit",
                    },
                  });
                }}
              />
              <label htmlFor="BuisnessVisit">Buisness Visit</label>
            </div>
            <div className="d-flex gap-1  align-items-center">
              <input
                className=""
                type={"radio"}
                id={"PersonalVisit"}
                disabled={disabled}
                name={name}
                value={inputFeild}
                onClick={() => {
                  self.setState({
                    inputFeild: {
                      ...state,
                      visitorPurposeOfVisit: "PersonalVisit",
                    },
                  });
                }}
              />
              <label htmlFor="PersonalVisit">Personal Visit</label>
            </div>
          </div>
        ) : (
          <>Input Type Missing</>
        )}
      </div>
    );
  }
}
