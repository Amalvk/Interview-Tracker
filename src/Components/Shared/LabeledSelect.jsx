import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function LabeledSelect({
  label,
  value,
  onChange,
  options,
  sx,
  minWidth = 160,
  getOptionColor,
  hideLabel = false,
}) {
  const labelId = `${label.replace(/\s+/g, '-').toLowerCase()}-select-label`;
  const selectedColor = getOptionColor?.(value);

  return (
    <FormControl size="small" sx={{ minWidth, ...sx }}>
      {!hideLabel && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select
        labelId={labelId}
        label={hideLabel ? undefined : label}
        aria-label={hideLabel ? label : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={
          selectedColor && {
            '& .MuiSelect-select': {
              bgcolor: selectedColor.bg,
              color: selectedColor.color,
              fontWeight: 600,
              borderRadius: 1,
            },
          }
        }
      >
        {options.map((opt) => {
          const optionColor = getOptionColor?.(opt.value);
          return (
            <MenuItem
              key={opt.value}
              value={opt.value}
              sx={
                optionColor && {
                  mx: 0.5,
                  my: 0.25,
                  borderRadius: 1,
                  bgcolor: optionColor.bg,
                  color: optionColor.color,
                  fontWeight: 600,
                  '&:hover': { bgcolor: optionColor.bg, filter: 'brightness(1.1)' },
                  '&.Mui-selected': { bgcolor: optionColor.bg, color: optionColor.color },
                  '&.Mui-selected:hover': { bgcolor: optionColor.bg, filter: 'brightness(1.1)' },
                }
              }
            >
              {opt.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
