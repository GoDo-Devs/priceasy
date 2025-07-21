import { NumericFormat } from "react-number-format";
import TextField from "@mui/material/TextField";

function CurrencyInput({
  value,
  onChange,
  prefix = "R$ ",
  suffix = "",
  placeholder = "",
  padding,
  ...rest
}) {
  return (
    <div style={{padding: padding}}>
      <NumericFormat
        size="small"
        customInput={TextField}
        value={value}
        onValueChange={(values) => onChange(values.floatValue)}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        prefix={prefix}
        suffix={suffix}
        fullWidth
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
}

export default CurrencyInput;
