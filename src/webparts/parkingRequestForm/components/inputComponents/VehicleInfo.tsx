import * as React from "react";

interface IVehicleInfoProps {
  type?: any;
  label: any;
  name: any;
  self: any;
  vehicleInfo: any;
  state: any;
  handleFileChange?: any;
  disabled: boolean;
  fileData?: any;
  // innerhtml:any
}

export default class VehicleInfo extends React.Component<
  IVehicleInfoProps,
  {}
> {
  public render(): React.ReactElement<IVehicleInfoProps> {
    const {
      type,
      label,
      name,
      self,
      vehicleInfo,
      state,
      handleFileChange,
      disabled,
    } = this.props;
    const handleChange = (event: { target: { name: any; value: any } }) => {
      const regex = /^\s+/;
      if (regex.test(event.target.value)) {
        self.setState({ inputFeild: { ...state, [event.target.name]: "" } });
        alert("Enter valid String");
      } else {
        self.setState({
          vehicleInfo: { ...state, [event.target.name]: event.target.value },
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
        {type === "textArea" ? (
          <textarea
            id={label}
            disabled={disabled}
            name={name}
            // dangerouslySetInnerHTML={innerhtml}
            value={vehicleInfo}
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
            onChange={handleFileChange}
            // required
            style={{ color: "transparent", cursor: "pointer" }}
          />
        ) : type === "date" || type === "text" ? (
          <input
            className="w-50 ps-3"
            type={type}
            disabled={disabled}
            id={label}
            name={name}
            value={vehicleInfo}
            onChange={handleChange}
            // required
            style={{
              color:
                type === "date" && vehicleInfo === "" ? "inherit" : "inherit",
            }}
          />
        ) : (
          <>Input Type Missing</>
        )}
      </div>
    );
  }
}
