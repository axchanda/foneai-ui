import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { Chart, ChartSelect, useChart } from 'src/components/chart';
import { Box, CardHeader } from '@mui/material';
import { varAlpha } from 'src/theme/styles';
import { useCallback, useState } from 'react';
import { useUsage } from 'src/context/usage.context';

// ----------------------------------------------------------------------

type Props = CardProps & {
  total: number;

  chart: {
    colors?: string[];
    series: Record<string, number>;
    options?: ChartOptions;
  };
};

export function MinutesUsed({ total, chart, ...other }: Props) {
  const theme = useTheme();
  const { credits } = useUsage();

  const usageMeter = Math.floor((credits.used / (credits.used + credits.available) )* 100);

  const [selectedSeries, setSelectedSeries] = useState('Jul');

  const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.primary.light];
  const chartWarningColors = chart.colors ?? [theme.palette.warning.main, theme.palette.warning.light];
  const chartErrorColors = chart.colors ?? [theme.palette.error.main, theme.palette.error.light];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    stroke: { width: 0 },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0,
            color: usageMeter > 75 ? (usageMeter > 90 ? chartErrorColors[0] : chartWarningColors[0]) : chartColors[0],
            opacity: 1 },
          { offset: 100, 
            color: usageMeter > 75 ? (usageMeter > 90 ? chartErrorColors[1] : chartWarningColors[1]) : chartColors[1],
            opacity: 1 },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        offsetY: 40,
        startAngle: -90,
        endAngle: 90,
        hollow: { margin: -24 },
        track: { margin: -24 },
        dataLabels: {
          name: { offsetY: 8 },
          value: { offsetY: -36 },
          total: {
            label: `Used ${credits.used} credits / ${credits.used + credits.available} `,
            color: theme.vars.palette.text.disabled,
            fontSize: theme.typography.caption.fontSize as string,
            fontWeight: theme.typography.caption.fontWeight,
          },
        },
      },
    },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue: string) => {
    setSelectedSeries(newValue);
  }, []);

  return (
    <Card {...other}>
      <CardHeader
        action={
          <ChartSelect
            options={Object.keys(chart.series)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        title="Credits Meter"
        subheader=""
        sx={{ mb: 5 }}
      />
      <Chart
        type="radialBar"
        series={[usageMeter]}
        options={chartOptions}
        width={240}
        height={240}
        sx={{ mx: 'auto' }}
      />

      <Box
        sx={{
          p: 5,
          gap: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ gap: 1, display: 'flex', alignItems: 'center', typography: 'subtitle2' }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.75,
              bgcolor: usageMeter > 75 ? (usageMeter > 90 ? chartErrorColors[0] : chartWarningColors[0]) : chartColors[0],
            }}
          />
          <Box sx={{ color: 'text.secondary', flexGrow: 1 }}>Used</Box>
          {credits.used}
        </Box>
        <Box sx={{ gap: 1, display: 'flex', alignItems: 'center', typography: 'subtitle2' }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.75,
              bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16)
            }}
          />
          <Box sx={{ color: 'text.secondary', flexGrow: 1 }}>
            Available
          </Box>
          {credits.available}
        </Box>
      </Box>
    </Card>
  );
}
