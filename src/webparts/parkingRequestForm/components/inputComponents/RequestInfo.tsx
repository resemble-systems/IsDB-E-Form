import * as React from "react";

interface IRequestInfoProps {
  type: any;
  label: any;
  name: any;
  self: any;
  requestorInfo: any;
  state: any;
}

export default class RequestInfo extends React.Component<
  IRequestInfoProps,
  {}
> {
  public render(): React.ReactElement<IRequestInfoProps> {
    const { type, label, name, self, requestorInfo, state } = this.props;
    const handleChange = (event: { target: { name: any; value: any; }; }) => {
      self.setState({
        requestorInfo: { ...state, [event.target.name]: event.target.value },
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
        </label>
        <input
          className="w-50 ps-3"
          type={type}
          id={label}
          name={name}
          value={requestorInfo}
          onChange={handleChange}
          style={{
            color:
              type === "date" && requestorInfo === ""
                ? "transparent"
                : "inherit",
          }}
        />
      </div>
    );
  }
}
