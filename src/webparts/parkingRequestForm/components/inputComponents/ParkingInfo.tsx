import * as React from "react";

interface IParkingInfoProps {
  label: any;
  parkingInfo: any;
  type?: any;
  name: any;
  state: any;
  self: any;
  options: any;
}

export default class ParkingInfo extends React.Component<
  IParkingInfoProps,
  {}
> {
  public render(): React.ReactElement<IParkingInfoProps> {
    const { label, parkingInfo, type, name, state, self, options } = this.props;

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
      self.setState({
        parkingInfo: { ...state, [event.target.name]: event.target.value },
      });
    };

    return (
      <div className="d-flex col-lg-6 col-md-6 col-sm-12 mb-2">
        <label
          className="w-50 ps-2 py-2"
          htmlFor={label}
          style={{ backgroundColor: "#F0F0F0" }}
        >
          {label}
          <span className="text-danger ms-2">*</span>
        </label>

        {type === "date" ? (
          <input
            className="w-50 ps-3"
            type={type}
            id={label}
            name={name}
            value={parkingInfo}
            onChange={handleChange}
            style={{
              color:
                type === "date" && parkingInfo === ""
                  ? "transparent"
                  : "inherit",
            }}
          />
        ) : (
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
            {options?.map((data: string | number | readonly string[] | undefined, index: React.Key | null | undefined) => (
              <option value={data} key={index}>
                {data}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
}
