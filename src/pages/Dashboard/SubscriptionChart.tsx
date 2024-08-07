import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

class SubscriptionChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: [new Date(), new Date()],
      series: [
        {
          name: 'subscription',
          data: [],
        },
      ],
      options: {
        chart: {
          height: 400,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            columnWidth: '30%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        colors: ['#3C50E0'],
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val;
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#304758'],
          },
        },
        xaxis: {
          categories: [],
          position: 'bottom',
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: true,
            formatter: function (val) {
              return val;
            },
            style: {
              fontSize: '12px',
            },
          },
        },
      },
      timeRange: 'weekly',
    };
  }

  componentDidMount() {
    this.fetchData(this.state.timeRange);
  }

  handleDateChange = (selectedDates) => {
    this.setState({ date: selectedDates }, () => {
      if (selectedDates.length === 2) {
        this.fetchDataByDate(this.state.date);
      }
    });
  };

  handleTimeRangeChange = (timeRange) => {
    this.setState({ timeRange }, () => {
      this.fetchData(timeRange);
    });
  };

  fetchData = (timeRange) => {
    const mockData = {
      weekly: {
        series: [11, 8, 13, 10, 9, 10, 15],
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      monthly: {
        series: [120, 150, 180, 170],
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      },
      yearly: {
        series: [1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
    };

    const data = mockData[timeRange];

    this.setState({
      series: [
        {
          name: 'subscription',
          data: data.series,
        },
      ],
      options: {
        ...this.state.options,
        xaxis: {
          ...this.state.options.xaxis,
          categories: data.categories,
        },
      },
    });
  };

  fetchDataByDate = (dateRange) => {
    // Simulated API call for custom date range
    // Here you can add logic to fetch data based on dateRange
    const data = {
      series: [10, 20, 15, 25, 30, 22, 18],
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    };

    this.setState({
      series: [
        {
          name: 'subscription',
          data: data.series,
        },
      ],
      options: {
        ...this.state.options,
        xaxis: {
          ...this.state.options.xaxis,
          categories: data.categories,
        },
      },
    });
  };

  render() {
    return (
      <div>
        <h2 className="text-xl font-semibold text-black dark:text-white ml-4 mb-4">
          Subscription(s)
        </h2>
        <div className="mb-4 flex items-center justify-between gap-4 ml-4">
          <div className="relative inline-block w-full max-w-xs bg-light-blue">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
            </span>
            <Flatpickr
              data-enable-time
              value={this.state.date}
              onChange={this.handleDateChange}
              options={{
                mode: 'range',
                dateFormat: 'm-d-y',
                defaultDate: [new Date(), new Date()],
                allowInput: true,
              }}
              className="datepicker w-full pl-10 pr-4 py-2 border border-stroke bg-white text-lg font-medium rounded shadow-card-2 focus-visible:outline-none dark:border-strokedark dark:bg-boxdark flatpickr-input active cursor-pointer"
            />
          </div>
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button onClick={() => this.handleTimeRangeChange('weekly')} className="mr-2 p-2 bg-blue-500 text-white rounded">Weekly</button>
            <button onClick={() => this.handleTimeRangeChange('monthly')} className="mr-2 p-2 bg-blue-500 text-white rounded">Monthly</button>
            <button onClick={() => this.handleTimeRangeChange('yearly')} className="p-2 bg-blue-500 text-white rounded">Yearly</button>
          </div>
        </div>
        <div id="chart">
          <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={400} />
        </div>
      </div>
    );
  }
}

export default SubscriptionChart;
