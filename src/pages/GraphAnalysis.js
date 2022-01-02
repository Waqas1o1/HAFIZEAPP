import React from 'react';
import {BarSeries , Chart, PieSeries} from '@devexpress/dx-react-chart-material-ui';
  
import { Grid, makeStyles, Typography, Paper, Divider, Container } from '@material-ui/core';
import InputField from '../components/InputField';



const data = [
{ year: '1950', population: 2.525 },
{ year: '1960', population: 3.018 },
{ year: '1970', population: 3.682 },
{ year: '1980', population: 4.440 },
{ year: '1990', population: 5.310 },
{ year: '2000', population: 6.127 },
{ year: '2010', population: 7.930 },
{ year: '2012', population: 8.930 },
{ year: '2013', population: 9.230 },
{ year: '2014', population: 10.930 },
{ year: '2015', population: 11.930 },
{ year: '2016', population: 12.130 },
{ year: '2017', population: 7.930 },
{ year: '2018', population: 14.0 },
{ year: '2019', population: 15.920 },
{ year: '2020', population: 16.930 },
{ year: '2021', population: 6.930 },
];

const data2 = [
    { country: 'Russia', area: 12 },
    { country: 'Canada', area: 7 },
    { country: 'USA', area: 7 },
    { country: 'China', area: 7 },
    { country: 'Brazil', area: 6 },
    { country: 'Australia', area: 5 },
    { country: 'India', area: 2 },
    { country: 'Others', area: 55 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding:theme.spacing(2),
    '@media only screen and (max-width: 600px)': {
       width:'380px',
       marginLeft:'-10px',
      },
  },
  paperBox:{
      height:'auto',
      width: '500px',
      padding:'20px'
  },
}));
 
const GraphAnalysis = () => {
    const classes = useStyles();
    return (
      <div className={classes.root}>
        <Typography variant='h3'  color='primary' gutterBottom>
              Dashboard
        </Typography>

        <Container maxWidth='xl'>
            <Grid container spacing={3} item xs className={classes.main}>
                {/* Sales  */}
                <Grid item xs={12}>
                    <Paper>
                    <Typography variant='h5'  color='primary' gutterBottom>
                        Graph Analysis
                    </Typography>
                    <Divider/>
                        <Chart data={data} >
                        <BarSeries
                            barWidth={0.5}
                            valueField="population"
                            argumentField="year"
                        />
                        </Chart>
                    </Paper>
                </Grid>
                {/* Total Sales */}
                {/* Char 1 */}
                <Grid item lg={4} xs container justifyContent='center' >
                    <Paper elevation={3} className={classes.paperBox}>
                        <Grid item xs={12}>
                            <Typography variant='h5' color='primary'> Sales By Sales-Officer</Typography>
                        </Grid>
                        <Divider  />
                        <br />
                        
                        <Grid item container spacing={3} >
                            <Grid item xs={6}>
                                <InputField  label='From Date' 
                                    type='string' size='small' 
                                    name='FromDate'
                                    value={'2021-09-10'}
                                    onChange={()=>{}}
                                    
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputField  label='From Date' 
                                    type='string' size='small' 
                                    name='FromDate'
                                    value={'2021-09-10'}
                                    onChange={()=>{}}
                                />
                            </Grid>
                            <Grid item xs={12} >
                            <Paper>
                                <Chart data={data} >
                                    <BarSeries
                                        barWidth={0.5}
                                        valueField="population"
                                        argumentField="year"
                                        color='#ff3333'
                                    />
                                </Chart>
                            </Paper>
                            </Grid>
                        </Grid>
                    
                    </Paper>
                </Grid>
            
                {/* Char 2 */}
                <Grid item lg={4} xs container justifyContent='center' >
                    <Paper elevation={3} className={classes.paperBox}>
                        <Grid item xs={12}>
                            <Typography variant='h5' color='primary'> Sales By Party</Typography>
                        </Grid>
                        <Divider  />
                        <br />
                        
                        <Grid item container spacing={3} >
                            <Grid item xs={6}>
                                <InputField  label='From Date' 
                                    type='string' size='small' 
                                    name='FromDate'
                                    value={'2021-09-10'}
                                    style={{color:'#64C1A4'}}
                                    onChange={()=>{}}
                                    
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputField  label='From Date' 
                                    type='string' size='small' 
                                    name='FromDate'
                                    value={'2021-09-10'}
                                    onChange={()=>{}}
                                />
                            </Grid>
                            <Grid item xs={12} >
                            <Paper>
                                <Chart data={data} >
                                    <BarSeries
                                        barWidth={0.5}
                                        valueField="population"
                                        argumentField="year"
                                        color='#64C1A4'
                                    />
                                </Chart>
                                </Paper>
                            </Grid>
                        </Grid>
                    
                    </Paper>
                </Grid>
            
                {/* Char 3 */}
                <Grid item lg={4} xs container justifyContent='center' >
                    <Paper elevation={3} className={classes.paperBox}>
                        <Grid item xs={12}>
                            <Typography variant='h5' color='primary'> Sales Analysis</Typography>
                        </Grid>
                        <Divider  />
                        <br />
                        
                        <Grid item container spacing={3} >
                            <Grid item xs={6}>
                                <InputField  label='From Date' 
                                    type='string' size='small' 
                                    name='FromDate'
                                    value={'2021-09-10'}
                                    onChange={()=>{}}
                                    
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <InputField  label='From Date' 
                                    type='string' size='small' 
                                    name='FromDate'
                                    value={'2021-09-10'}
                                    onChange={()=>{}}
                                />
                            </Grid>
                            <Grid item xs={12} >
                            <Paper>
                                <Chart data={data2}> 
                                <PieSeries
                                    valueField="area"
                                    argumentField="country"
                                />
                                </Chart>
                            </Paper>
                            </Grid>
                        </Grid>
                    
                    </Paper>
                </Grid>
            
            </Grid>
        </Container>
       </div>
    );
}

export default GraphAnalysis;
