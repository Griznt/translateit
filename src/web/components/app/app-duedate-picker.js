import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    width: 200
  }
});

function AppDueDatePicker(props) {
  const { classes } = props;
  const defaultDate = moment(moment(), "yyyy-MM-dd")
    .add(process.env.DUEDATE_DAYS_AWAITING || 3, "days")
    .toString();
  return (
    <form className={classes.container} noValidate>
      <TextField
        id="date"
        label={props.label}
        type="date"
        defaultValue={defaultDate}
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
      />
    </form>
  );
}

AppDueDatePicker.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppDueDatePicker);
