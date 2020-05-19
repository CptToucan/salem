import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';


import clsx from 'clsx';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  button: {
    flex: "1 1 0",
    margin: "5px",
    backgroundColor: "#f8c63c",
    '&:active': {
      backgroundColor: "#e9d08c"
    },
    '&:hover': {
      backgroundColor: "#e9d08c"
    },
    '&:focus': {
      backgroundColor: "#e9d08c"
    }
  },
  grid: {
    display: "flex"
  }
});




class PlayerView extends React.Component {

  constructor(props) {
    super(props);
    this.state = { bottom: false };
  }

  toggleDrawer(anchor, isOpen) {
    this.setState({...this.state, [anchor]: isOpen})
  }
  render() {
    const { classes } = this.props;
    let drawerAnchor = "bottom";
  
    return (
      <div className={classes.root}>
        <Grid container spacing={0}>
          <Grid item className={classes.grid} xs={12}></Grid>
          <Grid item className={classes.grid} xs={12}></Grid>
          <Grid item className={classes.grid}  xs={6}>
            <Button className={classes.button} variant="contained" size="large">
              Tryal
            </Button>
          </Grid>
          <Grid item className={classes.grid} xs={6}>
            <Button className={classes.button} variant="contained" size="large">
              My Character
            </Button>
          </Grid>
          <Grid item className={classes.grid} xs={6}>
            <Button className={classes.button} variant="contained" size="large">
              Applied to Me
            </Button>
          </Grid>
          <Grid item className={classes.grid} xs={6}>
            <Button className={classes.button} variant="contained" size="large">
              View Players
            </Button>
          </Grid>
          <Grid item className={classes.grid} xs={6}>
          
          <SwipeableDrawer
      anchor={drawerAnchor}
      open={this.state[drawerAnchor]}
      onClose={() => {this.toggleDrawer(drawerAnchor, false)}}
      onOpen={() => {this.toggleDrawer(drawerAnchor, true)}}
    >
      TEST!
    </SwipeableDrawer>

    <Button onClick={() => {this.toggleDrawer(drawerAnchor, true)}}>^</Button>

          </Grid>
        </Grid>
      </div>
    );
  }
}
/**
 *           <SwipeableDrawer
      anchor={drawerAnchor}
      open={this.state[drawerAnchor]}
      onClose={() => {this.toggleDrawer(drawerAnchor, false)}}
      onOpen={() => {this.toggleDrawer(drawerAnchor, true)}}
    >
      TEST!
    </SwipeableDrawer>

    <Button onClick={() => {this.toggleDrawer(drawerAnchor, true)}}>^</Button>
 */

export default withStyles(useStyles)(PlayerView);

/**
 *       <div>
        <div class="turn-status">{this.props.turnStatus}</div>
        <div class="game-log"></div>
        <div class="detail-buttons">
          <button class="detail-button">
            Tryal
          </button>
          <button class="detail-button">
            My Character
          </button>
          <button class="detail-button">
            Applied to Me
          </button>
          <button class="detail-button">
            View Players
          </button>
        </div>
      </div>
 */
