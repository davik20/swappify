import React, { FunctionComponent } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  container: {
    alignContent: 'stretch',
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'nowrap',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center'
    }
  },
  subcontainer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center',
      width: '39rem'
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'stretch',
      width: '100%'
    }
  }
}));

const AppBody: FunctionComponent = (props) => {
  const classes = style(useTheme());

  return (
    <div className={classes.container}>
      <div className={classes.subcontainer} {...props} />
    </div>
  );
};

export default AppBody;
