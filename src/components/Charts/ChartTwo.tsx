import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 500,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: ['03-Mon', '04-Tue', '05-Wed', '06-Thu', '07-Fri', '08-Sat', '09-Sun'],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
  totalAppointments: number;
  bookedViaSamara: number;
}

const ChartTwo: React.FC = () => {
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: 'Appointments',
        data: [22, 15, 28, 11, 18, 10, 16],
      },
    ],
    bookedViaSamara: 110,
    totalAppointments: 120,
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Appointment(s)
        </h2>
        <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
          <button className="rounded bg-white py-1 px-3 text-xs font-semibold text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
            Day
          </button>
          <button className="rounded py-1 px-3 text-xs font-semibold text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
            Week
          </button>
          <button className="rounded py-1 px-3 text-xs font-semibold text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
            Month
          </button>
        </div>
      </div>

      {/* <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 border border-stroke-dark rounded-md bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-medium text-black dark:text-white">Total Appointments</h3>
          <p className="text-2xl font-bold text-black dark:text-white">{state.totalAppointments}</p>
        </div>
        <div className="p-4 border border-stroke-dark rounded-md bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-medium text-black dark:text-white">Booked via Samara</h3>
          <p className="text-2xl font-bold text-black dark:text-white">{state.bookedViaSamara}</p>
        </div>
      </div> */}

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
