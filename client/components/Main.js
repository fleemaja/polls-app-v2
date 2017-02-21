import React from 'react';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue500} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import FaAlignLeft from 'react-icons/lib/fa/align-left';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue500
  },
  appBar: {
    height: 50,
  },
});

const Main = React.createClass({
  render() {
    const styles = {
      icon: {
        "color": "#77C7F7"
      }
    };
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Paper>
            <h1>
              <Link to="/">
                Poll Vault <FaAlignLeft style={styles.icon} />
              </Link>
            </h1>
          </Paper>
          {React.cloneElement({...this.props}.children, {...this.props})}
        </div>
      </MuiThemeProvider>
    )
  }
});

export default Main;
