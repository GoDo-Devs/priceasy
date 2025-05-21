import TextField from '@mui/material/TextField';
import { Autocomplete, InputLabel } from '@mui/material';

export default function AutoCompleteInput({options, label }) {
   
  return (
    <div>
      <InputLabel className="text-white mb-1">{label}</InputLabel>
      <Autocomplete
        disablePortal
        options={options.map((product)=> product.name)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
}