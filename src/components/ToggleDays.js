import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const DAYS = [
  {
    key: "Sunday",
    label: "S"
  },
  {
    key: "Monday",
    label: "M"
  },
  {
    key: "Tuesday",
    label: "T"
  },
  {
    key: "Wednesday",
    label: "W"
  },
  {
    key: "Thursday",
    label: "T"
  },
  {
    key: "Friday",
    label: "F"
  },
  {
    key: "Saturday",
    label: "S"
  }
];

const StyledToggleButtonGroup = withStyles(theme => ({
  grouped: {
    margin: theme.spacing(2),
    padding: theme.spacing(0, 1),
    "&:not(:first-child)": {
      border: "1px solid",
      borderColor: theme.palette.primary.dark,
      borderRadius: "50%"
    },
    "&:first-child": {
      border: "1px solid",
      borderColor: theme.palette.secondary.main,
      borderRadius: "50%"
    }
  }
}))(ToggleButtonGroup);

const StyledToggle = withStyles(theme=>({
  root: {
    color: theme.palette.secondary.main,
    "&$selected": {
      color: "white",
      background: theme.palette.primary.main
    },
    "&:hover": {
      borderColor: theme.palette.primary.light,
      background: theme.palette.primary.main
    },
    "&:hover$selected": {
      borderColor: theme.palette.primary.light,
      background: theme.palette.primary.dark
    },
    minWidth: 32,
    maxWidth: 32,
    height: 32,
    textTransform: "unset",
    fontSize: "0.75rem"
  },
  selected: {}
}))(ToggleButton);

const ToggleDays = (props) => {
const {days,setDays} = props;
  return (
    <>
      <StyledToggleButtonGroup
        size="small"
        arial-label="Days of the week"
        value={days}
        onChange={(event, value) =>setDays(value)}
      >
        {DAYS.map((day, index) => (
          <StyledToggle key={day.key} value={day.key} aria-label={day.key}>
            {day.label}
          </StyledToggle>
        ))}
      </StyledToggleButtonGroup>
    </>
  );
};

export default ToggleDays;
