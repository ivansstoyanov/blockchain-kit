import { TokenInfo } from "../models/TokenInfo";

const styles = {
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  select: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    outline: "none",
    transition: "0.3s ease-in-out",
  },
};

export const TokenSelect = ({
  tokens,
  label,
  selectedToken,
  onChange,
}: {
  tokens: TokenInfo[];
  label: string;
  selectedToken: TokenInfo | null;
  onChange: (token: TokenInfo | null) => void;
}) => (
  <div>
    <label style={styles.label}>{label}</label>
    <select
      value={selectedToken?.address || ""}
      onChange={(e) => {
        const selectedAddress = e.target.value;
        const token = tokens.find((t) => t.address === selectedAddress);
        onChange(token || null);
      }}
      style={styles.select}
    >
      <option value="" disabled hidden>
        -- Select a token --
      </option>
      {tokens.map((token) => (
        <option key={token.address} value={token.address}>
          {token.address}
        </option>
      ))}
    </select>
  </div>
);
