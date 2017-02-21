import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import { Doughnut } from 'react-chartjs-2';

const styles = {
  paper: {
      width: 300,
      padding: 10,
      margin: 20,
      display: 'inline-block',
  }
};

const DonutChart = React.createClass({
  render() {
    const poll = this.props.poll;
    const data = {
    	labels: poll.options.map(function(o) { return o['option']}),
    	datasets: [{
    		data: poll.options.map(function(o) { return o['votes']}),
    		backgroundColor: [
    		'#FF6384',
    		'#36A2EB',
    		'#FFCE56',
        '#36DBA2'
    		],
    		hoverBackgroundColor: [
    		'#FF6384',
    		'#36A2EB',
    		'#FFCE56',
        '#36EBA2'
    		]
    	}]
    };
    return (
      <Paper style={styles.paper}>
        <Doughnut
          data={data}
          width={300}
          height={300}
          options={{
              maintainAspectRatio: false
          }}
        />
      </Paper>
    )
  }
});

export default DonutChart;
