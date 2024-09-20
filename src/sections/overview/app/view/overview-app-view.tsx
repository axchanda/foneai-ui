import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';

import { useUsage } from 'src/context/usage.context';
import { SplashScreen } from 'src/components/loading-screen';
import { MinutesUsed } from '../MinutesUsed';
import { AppMinutesUsed } from '../app-minutes-used';
import { AppWidgetSummary } from '../app-widget-summary';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { channels, costPerMinute, credits, loading } = useUsage();

  const totalAvailableMinutes = Math.floor(credits.available * costPerMinute);

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      {loading ? (
        <SplashScreen />
      ) : (
        <Grid container spacing={3}>
          {/* <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Go now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid> */}

          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Total available minutes"
              percent={2.6}
              total={totalAvailableMinutes}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [15, 18, 12, 51, 68, 11, 39, 37],
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Total Channels"
              percent={0.2}
              total={channels}
              chart={{
                colors: [theme.vars.palette.info.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [20, 41, 63, 33, 28, 35, 50, 46],
              }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Total users"
              percent={-0.1}
              total={12}
              chart={{
                colors: [theme.vars.palette.error.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [18, 19, 31, 8, 16, 37, 12, 33],
              }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            {/* <AppCurrentDownload
            title="Current download"
            subheader="Downloaded by operating system"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          /> */}
            {/* <BookingAvailable
            title="Minutes used"
            chart={{
              series: [
                { label: 'Used', value: 120 },
                { label: 'Available', value: 66 },
              ],
            }}
          /> */}
            <MinutesUsed
              total={120}
              chart={{ series: { Jul: credits.used, Aug: credits.used, Sep: credits.used } }}
            />
          </Grid>

          <Grid alignSelf="stretch" xs={12} md={6} lg={8}>
            <AppMinutesUsed
              title="Minutes used"
              // subheader="(+43%) than last year"
              chart={{
                categories: [
                  '01',
                  '02',
                  '03',
                  '04',
                  '05',
                  '06',
                  '07',
                  '08',
                  '09',
                  '10',
                  '11',
                  '12',
                  '13',
                  '14',
                  '15',
                  '16',
                  '17',
                  '18',
                  '19',
                  '20',
                  '21',
                  '22',
                  '23',
                  '24',
                  '25',
                  '26',
                  '27',
                  '28',
                  '29',
                  '30',
                  // '',
                ],
                data: [
                  {
                    name: 'Jul',
                    data: Array.from(
                      { length: 30 },
                      () => Math.floor(Math.random() * (100 - 5 + 1)) + 5
                    ),
                  },
                  {
                    name: 'Aug',
                    data: Array.from(
                      { length: 30 },
                      () => Math.floor(Math.random() * (100 - 5 + 1)) + 5
                    ),
                  },
                  {
                    name: 'Sep',
                    data: Array.from(
                      { length: 30 },
                      () => Math.floor(Math.random() * (100 - 5 + 1)) + 5
                    ),
                  },
                ],
              }}
            />
          </Grid>

          {/* <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="New invoice"
            tableData={_appInvoices}
            headLabel={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid> */}

          {/* <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Related applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top installed countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top authors" list={_appAuthors} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{ series: 48 }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              chart={{
                series: 75,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Box>
        </Grid> */}
        </Grid>
      )}
    </DashboardContent>
  );
}
