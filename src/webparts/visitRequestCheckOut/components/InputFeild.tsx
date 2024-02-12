import * as React from "react";
import "./index.css";

interface IInputFeildProps {
  label: any;
  inputFeild?: any;
  type: string;
  name: string;
  state: any;
  self: any;
  options?: any;
  fileData?: any;
  handleFileChange?: any;
  disabled?:boolean
}

export default class InputFeild extends React.Component<IInputFeildProps, {}> {
  public render(): React.ReactElement<IInputFeildProps> {
    const {
      label,
      inputFeild,
      type,
      name,
      state,
      self,
      options,
      disabled,
      /*  fileData, */
      handleFileChange,
    } = this.props;

    const handleChange = (event: { target: { name: any; value: any } }) => {
      self.setState({
        inputFeild: { ...state, [event.target.name]: event.target.value },
      });
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
            disabled={disabled}
            onChange={handleChange}
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
            defaultValue={options[0]}
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
                onClick={() => {
                  self.setState({
                    inputFeild: { ...state, visitorNotify: "No" },
                  });
                }}
              />
              <label htmlFor="No">No</label>
            </div>
          </div>
        ) : (
          <>Input Type Missing</>
        )}
      </div>
    );
  }
}
