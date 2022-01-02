import { Container } from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { authCheckState } from '../../store/actions/auth';
import NavBar from '../../components/NavBar';
import { useLocation } from 'react-router';
import { requestForToken  } from '../../firebase';
// import { ToastContainer } from 'react-toastify';
const Layout = (props) => {
    const location = useLocation();
    useEffect(() => {
        props.onLoad();
     }, [location, props])

    useEffect(()=>{
        requestForToken();
        
    });
   
    return (
    <NavBar>
        <Container maxWidth='xl'>
            {/* <ToastContainer position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            /> */}
            {props.children}
        </Container>
    </NavBar>        
        
    );
};


const mapStateToProps = (state) =>{
    return {
        authenticated: state.token !== null
    };
  }
  const mapDispatchToProps = (dispatch) =>{
    return {
        onLoad: () => dispatch(authCheckState()),
    };
  }
  
export default connect(mapStateToProps,mapDispatchToProps)(Layout);

