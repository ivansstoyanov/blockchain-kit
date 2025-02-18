import { knownAddresses } from "./constants";

export function truncateAddress(
  address: string,
  frontcharsToShow: number = 6,
  backcharsToShow: number = 4,
  breakChar: string = "..."
) {
  return (
    address.substring(0, frontcharsToShow) +
    breakChar +
    address.substring(address.length - backcharsToShow, address.length)
  );
}

export const isKnownAddress = (address: string, hideAddress = false) => {
  if (knownAddresses[address.toLowerCase()]) {
    return `${knownAddresses[address.toLowerCase()]}: ${
      hideAddress ? "" : truncateAddress(address)
    }`;
  }
  return hideAddress ? truncateAddress(address) : address;
};
