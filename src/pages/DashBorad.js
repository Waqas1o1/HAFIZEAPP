import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import PersonPinCircleRoundedIcon from '@material-ui/icons/PersonPinCircleRounded';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Divider from '@material-ui/core/Divider';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import { connect } from 'react-redux';
import GroupStatus from '../utils/status';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ContactsIcon from '@material-ui/icons/Contacts';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PlaceIcon from '@material-ui/icons/Place';
import StorefrontIcon from '@material-ui/icons/Storefront';
import SettingsIcon from '@material-ui/icons/Settings';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ReceiptIcon from '@material-ui/icons/Receipt';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height:'130px',
    width:'130px',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },
  f60:{
    fontSize:40
  },
  textWhite:{
    color:'white'
  },
  bgBlue:{
    backgroundColor:'#170337'
  },
  bgGeray:{
    backgroundColor: '#434040'
  },
  bgPurpal:{
    backgroundColor: 'green'
  },
  link:{
    textDecoration:'None',
    fontSize:'12px'
  },
  bgred:{
    backgroundColor:'#FC5430'
  },
  f10:{
    fontSize:'14px'
  },
  overyLayIcon:{
    position:'absolute',
    marginLeft:'-3px',
    marginTop:'-30px'
  }
  
}));
 
const DashBorad = (props) => {
  const [isAdmin,setIsAdmin] = useState(false);
  const [isSalesOfficer,setIsSalesOfficer] = useState(false);
  const [isDispatcher,setIsDispatcher] = useState(false);
  const classes = useStyles();
  useEffect(()=>{
    const checkSatus = async (gp) =>{
      if (gp === GroupStatus.SUPERUSER){
        setIsAdmin(true);
      }
      else if (gp === GroupStatus.SALESOFFICER){
        setIsSalesOfficer(true);
      }
      else if (gp === GroupStatus.DISPATCHER){
        setIsDispatcher(true);
      }
    };
    checkSatus(props.group);
  },[props]);
  

    return (
      <div className={classes.root}>
        <Typography variant='h3'  color='primary' gutterBottom>
              Dashboard
        </Typography>
        
        {/* Add  */}
        {isAdmin?
        <Grid container style={{padding:'30px'}} spacing={2} justifyContent='center' alignItems="center" >
          <Grid item xs={12} >
            <Typography variant="h4" display="block" color='textSecondary'  align='center'>
                Add Entities
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/addParty'>
                <Paper className={`${classes.paper} ${classes.bgBlue}`}>
                  <HomeRoundedIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`}  display="block" gutterBottom >
                      Add Party
                  </Typography>
                </Paper>
              </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/addSupplier'>
                <Paper className={`${classes.paper} ${classes.bgBlue}`}>
                  <ContactsIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`}  display="block" gutterBottom >
                      Add Suppiler
                  </Typography>
                </Paper>
              </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
                <Link className={classes.link} to='/addDispatcher'>
                  <Paper className={`${classes.paper} ${classes.bgBlue}`}>
                    <HomeRoundedIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                    <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                        Add Dispatcher
                    </Typography>
                  </Paper>
                </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
                <Link className={classes.link} to='/addSalesofficer'>
                  <Paper className={`${classes.paper} ${classes.bgBlue}`}>
                    <HomeRoundedIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                    <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                        Add Sales Officer
                    </Typography>
                  </Paper>
                </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/addPartyDiscount'>
                <Paper className={`${classes.paper} ${classes.bgBlue}`}>
                  <PersonAddRoundedIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      Add Discount Category
                  </Typography>
                </Paper>
                </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
                <Link className={classes.link} to='/addCategory'>
                  <Paper className={`${classes.paper} ${classes.bgBlue}`}>
                    <CategoryIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                    <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                        Add Product Category
                    </Typography>
                  </Paper>
                </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
                <Link className={classes.link} to='/addProduct'>
                  <Paper className={`${classes.paper} ${classes.bgBlue}`}>
                    <AccountTreeIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                    <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                          Add Product
                    </Typography>
                  </Paper>
                </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/addBank'>
                <Paper className={`${classes.paper} ${classes.bgBlue}`}>
                  <AccountBalanceIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      Add Bank
                  </Typography>
                </Paper>
              </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/addArea'>
                <Paper className={`${classes.paper} ${classes.bgBlue}`}>
                  <PlaceIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      Add Area
                  </Typography>
                </Paper>
              </Link>
          </Grid>
        </Grid>:undefined
        }
   
        {/* View */}
        <Divider variant="middle" />
        <Grid container style={{padding:'30px'}} spacing={2} justifyContent='center'  alignItems="center">
          <Grid item xs={12} >
            <Typography variant="h4" display="block" color='textSecondary'  align='center'>
                Add Transaction
            </Typography>
          </Grid>
        {!isDispatcher?
        <>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/PartyOrder'>
                <Paper className={`${classes.paper} ${classes.bgPurpal}`}>
                  <PersonPinCircleRoundedIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                    Party Order
                  </Typography>
                </Paper>
              </Link>
          </Grid>

          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/Recovery'>
              <Paper className={`${classes.paper} ${classes.bgPurpal}`}>
                <AccountBalanceWalletIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                    Recovery
                </Typography>
              </Paper>
              </Link>
          </Grid>

          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/GroupRecovery'>
                <Paper className={`${classes.paper} ${classes.bgPurpal}`}>
                  <MergeTypeIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      Group Recovery
                  </Typography>
                </Paper>
              </Link>
          </Grid>
        </>:undefined
        }
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/ViewOrder'>
                <Paper className={`${classes.paper} ${classes.bgPurpal}`}>
                  <VisibilityRoundedIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      View Order
                  </Typography>
                </Paper>
              </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/Purchase'>
                <Paper className={`${classes.paper} ${classes.bgPurpal}`}>
                  <StorefrontIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      Purchases Inventory
                  </Typography>
                </Paper>
              </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/RecoveryReport'>
                <Paper className={`${classes.paper} ${classes.bgPurpal}`}>
                  <FeaturedPlayListIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      Recoveries Report
                  </Typography>
                </Paper>
              </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/Cheque'>
                <Paper className={`${classes.paper} ${classes.bgPurpal}`}>
                  <ReceiptIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      Cheques
                  </Typography>
                </Paper>
              </Link>
          </Grid>
        </Grid>

        {/* Ledger */}
     
        <Divider variant="middle" />
        {isSalesOfficer | isAdmin ?
        <Grid container style={{padding:'30px'}} spacing={2} justifyContent='center'  alignItems="center" >          
          
          <Grid item xs={12} >
            <Typography variant="h4" display="block" color='textSecondary' align='center'>
                Ledgers
            </Typography>
          </Grid>
       
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
            <Link className={classes.link} to='/PartyLedger'>
              <Paper className={`${classes.paper} ${classes.bgred}`}>
                <MenuBookIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                    Party Ledger
                </Typography>
              </Paper>
            </Link>
          </Grid>
        {isAdmin?
        <>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/CashLedger'>
              <Paper className={`${classes.paper} ${classes.bgred}`}>
                <MenuBookIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                  Cash Ledger
                </Typography>
              </Paper>
              </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/ChequeLedger'>
              <Paper className={`${classes.paper} ${classes.bgred}`}>
                <MenuBookIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                  Cheque Ledger
                </Typography>
              </Paper>
              </Link>
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
            <Link className={classes.link} to='/salesOfficerLedger'>
              <Paper className={`${classes.paper}  ${classes.bgred}`}>
                <MenuBookIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      Sales Officer Leadger
                  </Typography>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
            <Link className={classes.link} to='/SalesLedger'>
              <Paper className={`${classes.paper}  ${classes.bgred}`}>
                <MenuBookIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                      Sales Ledger
                  </Typography>
              </Paper>
            </Link>
          </Grid>    
               
              
               
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
              <Link className={classes.link} to='/BankLedger'>
                <Paper className={`${classes.paper} ${classes.bgred}`}>
                  <MenuBookIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                  <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                        Bank Ledger
                    </Typography>
                </Paper>
              </Link>
          </Grid>
        </>:undefined
        }   

        </Grid>:undefined
        }
        <Divider variant="middle" />
        {isAdmin?
        <Grid container style={{padding:'30px'}} spacing={2} justifyContent='center'  alignItems="center" >          
          <Grid item xs={12} >
            <Typography variant="h4" display="block" color='textSecondary' align='center'>
                Management
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
            <Link className={classes.link} to='/Adjustments'>
              <Paper className={`${classes.paper} ${classes.bgGeray}`}>
                <EqualizerIcon fontSize='large' className={`${classes.textWhite} ${classes.f60}`}/>
                <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                    Ledger Adjustments
                </Typography>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
            <Link className={classes.link} to='/VehicalsManagment'>
              <Paper className={`${classes.paper} ${classes.bgGeray}`}>
                <SettingsIcon className={classes.overyLayIcon}/>
                <LocalShippingIcon fontSize='large'className={`${classes.textWhite} ${classes.f60}`}/>
                <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                    Vehicals Management
                </Typography>
              </Paper>
            </Link>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2} container justifyContent='center'>
            <Link className={classes.link} to='/EmployeeMangement'>
              <Paper className={`${classes.paper} ${classes.bgGeray}`}>
                <SupervisedUserCircleIcon fontSize='large'className={`${classes.textWhite} ${classes.f60}`}/>
                <Typography variant="button" className={`${classes.f10} ${classes.textWhite}`} display="block" gutterBottom >
                    Eomployee Management
                </Typography>
              </Paper>
            </Link>
          </Grid>
        </Grid>
        :undefined}
    </div>
    );
}
const mapStateToProps = (state) =>{
  return {
      authenticated: state.token !== null,
      group: state.group
  };
}


export default connect(mapStateToProps,null)(DashBorad);

