import React from "react";
import { isKnownAddress } from "../utils/utils";

export const Address = (props: {
  address: string | null | undefined;
  hideAddress?: boolean;
}) => {
  return props.address ? (
    <span
      className="copy"
      onClick={() => navigator.clipboard.writeText(props.address || "")}
    >
      {`${isKnownAddress(props.address, props.hideAddress)}`} 📋
    </span>
  ) : null;
};
