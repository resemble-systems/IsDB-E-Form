import * as React from "react";
import "./index.css";

interface IInputFeildProps {
  label: string;
  inputFeild?: any;
  type: string;
  name: string;
  state: any;
  self: any;
  options?: any;
  fileData?: any;
  handleFileChange?: any;
  disabled?: boolean;
}

export default class InputFeild extends React.Component<IInputFeildProps, {}> {
  public render(): React.ReactElement<IInputFeildProps> {
    const {
      label,
      inputFeild,
      disabled,
      type,
      name,
      state,
      self,
      options,
      /*  fileData, */
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
          className={`ps-2 py-2 ${type === "file" ? "w-100" : "w-50"}`}
          htmlFor={label}
          style={{ backgroundColor: "#F0F0F0" }}
        >
          {label}
          
        </label>

        {type === "date" || type === "text" ? (
          <input
            className="w-50 ps-3"
            type={type}
            disabled={disabled}
            id={label}
            name={name}
            value={inputFeild}
            onChange={handleChange}
            style={{
              color:
                type === "date" && inputFeild === ""
                  ? "transparent"
                  : "inherit",
            }}
          />
        ) : type === "select" ? (
          <select
            className="w-50 ps-2"
            id={label}
            name={name}
            disabled={disabled}
            // defaultValue={options[0]}
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
        ) : type === "file" ? (
          <input
            className="w-100 ps-2"
            type={type}
            disabled={disabled}
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
                disabled={disabled}
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
               disabled={disabled}
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
