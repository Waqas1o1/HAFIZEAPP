import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core";
// import { ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import { authCheckState } from "./store/actions/auth";

import Layout from "./pages/container/Layout";
// Main Pages
import GraphAnalysis from "./pages/GraphAnalysis";
import DashBorad from "./pages/DashBorad";
// Add
import AddParty from "./pages/Add/AddParty";
import AddPartyDiscount from "./pages/Add/AddPartyDiscount";
import AddCategory from "./pages/Add/AddCategory";
import AddBank from "./pages/Add/AddBank";
import AddProduct from "./pages/Add/AddProduct";
import AddArea from "./pages/Add/AddArea";
import AddSalesOfficer from "./pages/Add/AddSalesOfficer";
import AddDispatchperson from "./pages/Add/AddDispatchperson";
import AddSupplier from "./pages/Add/AddSupplier";
import AddVehical from "./pages/Admin/VehicalsManagement/AddVehical";
import AddProducts from "./pages/Admin/VehicalsManagement/AddProducts";
// Ledgers
import PartyLedger from "./pages/Ledgers/PartyLedger";
import CashLedger from "./pages/Ledgers/CashLedger";
import SalesOfficerLedger from "./pages/Ledgers/SalesOfficerLedger";
import SalesLedger from "./pages/Ledgers/SalesLedger";
import BankLedger from "./pages/Ledgers/BankLedger";
import ChequeLedger from "./pages/Ledgers/ChequeLedger";
// Management
import Import from "./pages/Admin/Import";
import Adjustments from "./pages/Admin/Adjustments";
import VehicalsManagment from "./pages/Admin/VehicalsManagement/VehicalsManagment";

// UI
import PartyOrder from "./pages/Records/PartyOrder";
import OrderView from "./pages/Records/OrderView";
import Purchases from "./pages/Records/Purchases";
import Recovery from "./pages/Records/Recovery";
import GroupRecovery from "./pages/Records/GroupRecovery";
import Cheque from "./pages/Records/Cheque";
// Vehical Management
import AddSpareParts from "./pages/Admin/VehicalsManagement/AddSpareParts";
import DispatchPart from "./pages/Admin/VehicalsManagement/DispatchPart";
import Login from "./pages/Authentications/Login";
import RecoveryReport from "./pages/Records/RecoveryReport";
// Employee mangement
import EmployeeMangement from "./pages/Admin/EmployeeManagement/EmployeeManagement";
import AddEmployee from "./pages/Admin/EmployeeManagement/AddEmployee";
import AddDepartment from "./pages/Admin/EmployeeManagement/AddDepartment";
import AddRole from "./pages/Admin/EmployeeManagement/AddRole";
import AdvancePayment from "./pages/Admin/EmployeeManagement/PayAdvance";

const theme = createTheme({
  palette: {
    primary: {
      light: "#baf6e3",
      main: "#64C1A4",
      dark: "#009D72",
    },
    success: {
      main: "#64C1A4",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h3: {
      "@media only screen and (max-width: 600px)": {
        fontSize: "20px",
      },
    },
    h4: {
      "@media only screen and (max-width: 600px)": {
        fontSize: "18px",
      },
    },
    h5: {
      "@media only screen and (max-width: 600px)": {
        fontSize: "16px",
      },
    },
  },
});

const App = (props) => {



  useEffect(() => {
    props.onLoad();
  }, [props]);
 
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/Graph" component={GraphAnalysis} />
            <Route exact path="/" component={DashBorad} />
            <Route exact path="/addParty" component={AddParty} />
            <Route exact path="/addSalesofficer" component={AddSalesOfficer} />
            <Route exact path="/addDispatcher" component={AddDispatchperson} />
            <Route
              exact
              path="/addPartyDiscount"
              component={AddPartyDiscount}
            />
            <Route exact path="/addCategory" component={AddCategory} />
            <Route exact path="/addBank" component={AddBank} />
            <Route exact path="/addProduct" component={AddProduct} />
            <Route exact path="/addSupplier" component={AddSupplier} />
            <Route exact path="/addVehical" component={AddVehical} />
            <Route exact path="/addArea" component={AddArea} />
            {/* Ledgers */}
            <Route exact path="/PartyLedger" component={PartyLedger} />
            <Route exact path="/CashLedger" component={CashLedger} />
            <Route exact path="/SalesOfficerLedger"component={SalesOfficerLedger}/>
            <Route exact path="/SalesLedger" component={SalesLedger} />
            <Route exact path="/BankLedger" component={BankLedger} />
            <Route exact path="/ChequeLedger" component={ChequeLedger} />
            {/* Records */}
            <Route exact path="/PartyOrder" component={PartyOrder} />
            <Route exact path="/ViewOrder" component={OrderView} />
            <Route exact path="/GroupRecovery" component={GroupRecovery} />
            <Route exact path="/Recovery" component={Recovery} />
            <Route exact path="/Purchase" component={Purchases} />
            <Route exact path="/Cheque" component={Cheque} />
            <Route exact path="/RecoveryReport" component={RecoveryReport} />
            {/* Authentication */}
            <Route exact path="/Login" component={Login} />
            {/* Admin */}
            <Route exact path="/Import" component={Import} />
            <Route exact path="/Adjustments" component={Adjustments} />
            <Route exact path="/VehicalsManagment" component={VehicalsManagment} />
            {/* Vehical Management */}
            <Route exact path="/addSapreParts" component={AddSpareParts} />
            <Route exact path="/dipatchPart" component={DispatchPart} />
            <Route exact path="/addVehicalProducts" component={AddProducts} />
            {/* EmployeeManagement  */}
            <Route exact path="/EmployeeMangement" component={EmployeeMangement} />
            <Route exact path="/addEmployee" component={AddEmployee} />
            <Route exact path="/addDepartment" component={AddDepartment} />
            <Route exact path="/addRole" component={AddRole} />
            <Route exact path="/advancePayment" component={AdvancePayment} />

          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticated: state.token !== null,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => dispatch(authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
