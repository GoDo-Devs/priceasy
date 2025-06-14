import {
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

function CheckBoxInput({
  value = [],
  name,
  onChange,
  label,
  options = [],
  className,
}) {
  const handleCheckboxChange = (event) => {
    const checkboxValue = Number(event.target.value);
    const { checked } = event.target;
    let newValue = [];

    if (checked) {
      newValue = [...value, checkboxValue];
    } else {
      newValue = value.filter((v) => v !== checkboxValue);
    }

    onChange({
      target: {
        name,
        value: newValue,
      },
    });
  };

  return (
    <div className={className}>
      <InputLabel className="text-white">{label}</InputLabel>
      <FormGroup
        sx={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                value={option.value}
                checked={value.some((v) => Number(v) === Number(option.value))}
                onChange={handleCheckboxChange}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </div>
  );
}

export default CheckBoxInput;
