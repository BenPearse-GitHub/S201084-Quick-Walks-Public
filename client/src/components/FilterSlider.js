import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import VolumeUp from "@mui/icons-material/VolumeUp";

const Input = styled(MuiInput)`
  width: 42px;
`;

function FilterSlider(props) {
  const { name, min, max, step, onChange, displayName, defaultValue } = props;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    } else {
      setValue(min);
    }
  }, [defaultValue]);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < min) {
      setValue(min);
    } else if (value > max) {
      setValue(max);
    }
  };

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <Box sx={{ width: "100%" }}>
      {displayName && (
        <Typography id="input-slider" gutterBottom>
          {name}
        </Typography>
      )}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            step={step}
            type="number"
            min={min}
            max={max}
            marks
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: step,
              min: min,
              max: max,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default FilterSlider;
