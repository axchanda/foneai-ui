import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';
import { Box, CardHeader } from '@mui/material';
import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

type Props = CardProps & {
  total: number;

  chart: {
    colors?: string[];
    series: number;
    options?: ChartOptions;
  };
};

export function MinutesUsed({ total, chart, ...other }: Props) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [theme.palette.secondary.main, theme.palette.secondary.light];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    stroke: { width: 0 },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: chartColors[0], opacity: 1 },
          { offset: 100, color: chartColors[1], opacity: 1 },
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
            label: `Used ${chart.series} mins / ${total} mins`,
            color: theme.vars.palette.text.disabled,
            fontSize: theme.typography.caption.fontSize as string,
            fontWeight: theme.typography.caption.fontWeight,
          },
        },
      },
    },
    ...chart.options,
  });

  return (

    <Card {...other}>
      <CardHeader title={'Minutes Available'} subheader={''} sx={{ mb: 5 }} />

      <Chart
        type="radialBar"
        series={[chart.series]}
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
        <Box
          sx={{ gap: 1, display: 'flex', alignItems: 'center', typography: 'subtitle2' }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.75,
              bgcolor: chartColors[1]
            }}
          />
          <Box sx={{ color: 'text.secondary', flexGrow: 1 }}>Used</Box>
          {chart.series} minutes
        </Box>
        <Box
          sx={{ gap: 1, display: 'flex', alignItems: 'center', typography: 'subtitle2' }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: 0.75,
              bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
              // ...(item.label === 'Used' && ),

            }}
          />
          <Box sx={{ color: 'text.secondary', flexGrow: 1 }}>Available</Box>
          {total - chart.series} minutes
        </Box>
      </Box>
    </Card>

  );
}