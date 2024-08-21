/* eslint-disable @typescript-eslint/no-shadow */
import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart, ChartSelect } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories: string[];
    data: {
      name: string;
      data: number[];
    }[];

    // series: {
    //   name: string;
    //   data: number[];
    // }[];
    options?: ChartOptions;
  };
};

export function AppMinutesUsed({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const [selectedSeries, setSelectedSeries] = useState('Jul');

  const series = chart.data.filter((i) => i.name === selectedSeries)!;

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const chartOptions = useChart({
    // chart: {
    //   stacked: true,
    // },
    colors: chartColors,
    // stroke: { width: 0 },
    xaxis: {
      categories: chart.categories,

      labels: {
        formatter: (value) => (+value === 1 || +value % 5 === 0 ? value : ''),
      },
    },
    tooltip: {
      enabled: true,
      // shared: false,
      // y: { formatter: (value: number) => fNumber(value) },
      // x: { formatter: (value) => fNumber(value) },
      // x: {
      //   formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
      //     const x = w.globals.labels[dataPointIndex];
      //     return `${x}: ${value}`;
      //   },
      // },
      custom({ series, seriesIndex, dataPointIndex, w }) {
        const x = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];

        return `<div class="arrow_box custom-tooltip">
          <div  className="top">
            ${selectedSeries} - ${x}
          </div>
          <hr/>
          <div className="bottom">
            ${value}
          </div>
        </div>`;
        // return `<div class="arrow_box">${selectedSeries} ${x}: ${value}</div>`;
      },
    },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue: string) => {
    setSelectedSeries(newValue);
  }, []);

  // const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  return (
    <Card
      sx={{
        height: '100%',
      }}
      {...other}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.data.map((item) => item.name)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      {/* <ChartLegends
        colors={chartOptions?.colors}
        labels={chart.series[0].data.map((item) => item.name)}
        values={[fShortenNumber(1234), fShortenNumber(6789), fShortenNumber(1012)]}
        sx={{
          px: 3,
          gap: 3,
        }}
      /> */}

      <Chart
        type="line"
        series={series}
        options={chartOptions}
        height={320}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
