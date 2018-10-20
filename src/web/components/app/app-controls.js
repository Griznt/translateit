import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import {
  FormControl,
  NativeSelect,
  FormHelperText,
  TextField
} from "@material-ui/core";
import AppDuedatePicker from "./app-duedate-picker";
// import InboxIcon from "@material-ui/icons/Inbox";
// import DraftsIcon from "@material-ui/icons/Drafts";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    container: {
      display: "flex",
      flexWrap: "wrap"
    }
  },
  textField: {
    width: 200
  },
  formControl: {
    width: 200
  }
});

const AppControls = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem button>
          <ListItemText primary="Translate!" />
          <ListItemIcon>
            {/* <CloudUploadIcon className={classes.leftIcon} /> */}
          </ListItemIcon>
        </ListItem>
        <ListItem button>
          <FormControl className={classes.formControl}>
            <NativeSelect
              className={classes.selectEmpty}
              name="source"
              onChange={props.onSelectSourceLanguage}>
              {props.languages.map((language, i) => {
                return (
                  <option key={i} value={language.value}>
                    {language.label}
                  </option>
                );
              })}
            </NativeSelect>
            <FormHelperText>source language</FormHelperText>
          </FormControl>
        </ListItem>
        <ListItem button>
          <FormControl className={classes.formControl}>
            <NativeSelect
              className={classes.selectEmpty}
              name="source"
              onChange={props.onSelectSourceLanguage}>
              {props.languages.map((language, i) => {
                return (
                  <option key={i} value={language.value}>
                    {language.label}
                  </option>
                );
              })}
            </NativeSelect>
            <FormHelperText>target language</FormHelperText>
          </FormControl>
        </ListItem>
        <ListItem button>
          <AppDuedatePicker label="Due Date" />
        </ListItem>
        <ListItem button>
          <TextField
            error={!!props.error}
            id="user email"
            label={props.error ? props.error.message : "Email"}
            className={classes.textField}
          />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Translate!" />
        </ListItem>
      </List>
    </div>
  );
};

AppControls.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AppControls);
