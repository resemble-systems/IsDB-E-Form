import * as React from "react";

interface IVehicleInfoProps {
  type?: any;
  label: any;
  name: any;
  self: any;
  vehicleInfo: any;
  state: any;
  handleFileChange?: any;
}

export default class VehicleInfo extends React.Component<
  IVehicleInfoProps,
  {}
> {
  public render(): React.ReactElement<IVehicleInfoProps> {
    const { type, label, name, self, vehicleInfo, state ,handleFileChange} = this.props;
    const handleChange = (event: { target: { name: any; value: any; }; }) => {
      self.setState({
        vehicleInfo: { ...state, [event.target.name]: event.target.value },
      });
    };

    return (
      <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
        <label
          className={`w-50 ps-2 d-flex align-items-center ${
            type === "textArea" ? "py-5" : "py-2"
          }`}
          htmlFor={label}
          style={{ backgroundColor: "#F0F0F0" }}
        >
          {label}
          <span className="text-danger ms-2">*</span>
        </label>
        {type === "textArea" ? (
          <textarea
            id={label}
            name={name}
            value={vehicleInfo}
            onChange={handleChange}
            className="w-50 ps-3"
          />
        ) : (
          <input
            className="w-50 ps-3"
            type={type}
            id={label}
            name={name}
            value={vehicleInfo}
            onChange={handleFileChange}
            style={{
              color:
                type === "date" && vehicleInfo === ""
                  ? "transparent"
                  : "inherit",
            }}
          />
        )}
      </div>
    );
  }
}
