import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Card, CardContent, Typography, Divider, Stack, Input } from '@mui/material';
import { useUsage } from 'src/context/usage.context';
import { SplashScreen } from 'src/components/loading-screen';
import { CreditsUsed } from '../CreditsUsed';
import { AppCreditsUsed } from '../app-credits-used';
import { AppWidgetSummary } from '../app-widget-summary';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { Field } from 'src/components/hook-form';
import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';
import API from 'src/utils/API';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { channels, credits, loading } = useUsage();

  const availableCredits = Math.floor(credits.available);

  const theme = useTheme();

  const router = useRouter();

  const showChannelDialog = useBoolean(false);
  const [channelCount, setChannelCount] = useState(0);
  const channelReqInProgress = useBoolean(false);

  const handleChannelIncrease = async (data: any) => {
    try {
      console.log(data);
      channelReqInProgress.onTrue();
      const {data: channelReq} = await API.post('/requests/increaseChannel', data);
      if (channelReq) {
        console.log(channelReq);
        toast.success(channelReq.message);
        channelReqInProgress.onFalse();
        showChannelDialog.onFalse();
      }
    } catch (error) {
      console.log(error)
      if(error.response && error.response.status === 400) {
        console.log(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        console.log(error && error.message);
      }
      channelReqInProgress.onFalse();
      showChannelDialog.onFalse();
    }
  }

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
              title="Available credits"
              percent={2.6}
              total={availableCredits}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [15, 18, 12, 51, 68, 11, 39, 37],
              }}
              rightIcon='material-symbols:add-shopping-cart-rounded'
              rightIconTooltip='Purchase credits'
              invokeFunction={() => router.push('/checkout')}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Concurrent Channels"
              percent={0.2}
              total={channels}
              chart={{
                colors: [theme.vars.palette.info.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [20, 41, 63, 33, 28, 35, 50, 46],
              }}
              rightIcon='streamline:graph-arrow-increase'
              rightIconTooltip='Increase channels'
              invokeFunction={showChannelDialog.onTrue}
            />
            <Dialog open={showChannelDialog.value} onClose={() => {
              showChannelDialog.onFalse();
              setChannelCount(0);
            }}>
                <DialogTitle>Increase Channels</DialogTitle>
                <Divider />
                <DialogContent>
                    <Card>
                        <CardContent>
                        <Stack spacing={2} direction="row" alignItems="center">
                          <Typography variant="h6" gutterBottom>
                            Channel Count:
                          </Typography>
                          <Button
                            variant="contained"
                            color="error"
                            disabled={channelCount === 0}
                            sx={{
                              borderRadius: '50%',
                              minWidth: '30px', // Reduced button size
                              minHeight: '30px', // Reduced button size
                              padding: 0, // Remove extra padding
                            }}
                            onClick={() => setChannelCount(Math.max(0, channelCount - 1))}
                          >
                            <Iconify icon="mdi:minus" fontSize="small" />
                          </Button>

                          <Input
                            name="channel_count"
                            type="number"
                            placeholder="Enter number of channels"
                            required
                            value={channelCount}
                            onChange={(e) => setChannelCount(parseInt(e.target.value))}
                            sx={{
                              textAlign: 'center', // Align input text to the right
                              flex: 1, // Take up remaining space
                              maxWidth: '100px', // Limit width of the input
                            }}
                          />

                          <Button
                            variant="contained"
                            color="success"
                            sx={{
                              borderRadius: '50%',
                              minWidth: '30px', // Reduced button size
                              minHeight: '30px', // Reduced button size
                              padding: 0, // Remove extra padding
                            }}
                            onClick={() => setChannelCount(channelCount + 1)}
                          >
                            <Iconify icon="mdi:plus" fontSize="small" />
                          </Button>

                          </Stack>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button 
                      variant='outlined'
                      onClick={showChannelDialog.onFalse}
                      color="error"

                    >
                      Cancel
                    </Button>
                    <LoadingButton 
                      loading={channelReqInProgress.value}
                      variant='contained'
                      onClick={() => {
                        handleChannelIncrease({channelCount});
                      }}
                      color="primary"
                      disabled={channelCount === 0}
                    >
                      Request Increase
                    </LoadingButton>
                </DialogActions>
            </Dialog>
          </Grid>

          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="All users"
              percent={-0.1}
              total={0}
              chart={{
                colors: [theme.vars.palette.error.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [18, 19, 31, 8, 16, 37, 12, 33],
              }}
              rightIcon='mdi:user-add'
              rightIconTooltip='Add new user'
              invokeFunction={() => router.push('/users/create')}
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
            title="Credits Used"
            chart={{
              series: [
                { label: 'Used', value: 120 },
                { label: 'Available', value: 66 },
              ],
            }}
          /> */}
            <CreditsUsed chart={{}} />
              {/* chart={{ series: { Jul: credits.used, Aug: credits.used, Sep: credits.used } }}
            /> */}
          </Grid>

          <Grid alignSelf="stretch" xs={12} md={6} lg={8}>
            <AppCreditsUsed
              title="Credits Usage chart"
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
                    name: 'Sep',
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
                    name: 'Jul',
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
