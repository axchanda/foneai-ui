import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { _appFeatured } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { useMockedUser } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { BookingAvailable } from '../../booking/booking-available';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
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
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total active users"
            percent={2.6}
            total={18765}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total installed"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total downloads"
            percent={-0.1}
            total={678}
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
          <BookingAvailable
            title="Minutes used"
            chart={{
              series: [
                { label: 'Used', value: 120 },
                { label: 'Available', value: 66 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area installed"
            subheader="(+43%) than last year"
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
                '31',
              ],
              series: [
                {
                  name: 'Jul',
                  data: [
                    {
                      name: 'Asia',
                      data: [
                        6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42,
                        44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66,
                      ],
                    },
                    {
                      name: 'Europe',
                      data: [
                        6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42,
                        44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66,
                      ],
                    },
                    {
                      name: 'Americas',
                      data: [
                        6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42,
                        44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66,
                      ],
                    },
                  ],
                },
                {
                  name: 'Aug',
                  data: [
                    {
                      name: 'Asia',
                      data: [
                        6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6, 10,
                        12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6,
                      ],
                    },
                    {
                      name: 'Europe',
                      data: [
                        6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6, 10,
                        12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6,
                      ],
                    },
                    {
                      name: 'Americas',
                      data: [
                        6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6, 10,
                        12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6,
                      ],
                    },
                  ],
                },
                {
                  name: 'Sep',
                  data: [
                    {
                      name: 'Asia',
                      data: [
                        6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6, 10,
                        12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6,
                      ],
                    },
                    {
                      name: 'Europe',
                      data: [
                        6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6, 10,
                        12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6,
                      ],
                    },
                    {
                      name: 'Americas',
                      data: [
                        6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6, 10,
                        12, 17, 18, 10, 6, 20, 15, 18, 7, 24, 6,
                      ],
                    },
                  ],
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
    </DashboardContent>
  );
}
