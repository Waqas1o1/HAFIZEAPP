import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@material-ui/core";
import Selecter from "../../components/Selecter";
import axiosInstance from "../../apisConfig";
import InputField from "../../components/InputField";
import AutoSuggestField from "../../components/AutoSuggestField";
import ReceiptIcon from "@material-ui/icons/Receipt";
import MenuItems from "../../components/MenuItems";
import "../../static/css/partyorder.css";
// import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  formRoot:{
    padding:'10px',
  },
  textArea: {
    width: "100%",
    maxWidth: "100%",
    minHeight: "150px",
    maxHeight: "350px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
  },
  gultter: {
    marginBottom: theme.spacing(2),
  },
  white: {
    color: "white",
  },
  bgBlue: {
    backgroundImage: "linear-gradient(45deg,#1976d2,#64b5f6)",
  },
  table: {
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: theme.palette.primary.dark,
      cursor: "pointer",
    },
  },
  xsFull: {
    "@media only screen and (max-width: 600px)": {
      width: "35vh",
    },
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}))(TableCell);

export default function PartyOrder(props) {
  const classes = useStyles();
  const initialFields = {
    party: "",
    sale_officer: "",
    description: "",
    freight: 0,
    total_amount: "",
    gross_total: "",
    locations: "",
  };

  const [fields, setFields] = useState(initialFields);
  // Parties
  const [parties, setParties] = useState([]);
  const [partyTitle, setPartyTitle] = useState("Select Party");
  // Sales Officer
  const [salesOfficers, setSalesOfficers] = useState([]);
  const [salesOfficerTitle, setSalesOfficerTitle] = useState(
    "Select Sales Officer"
  );
  const [salesOfficerDisabled, setSalesOfficerDisabled] = useState(false);
  const [selectedSalesOfficer, setSelectedSalesOfficer] = useState(null);
  // Products
  const initialProductFields = {
    product: "",
    qty: "",
    rate: "",
    freight: 0,
  };
  const [mapLocations, setMapLocations] = useState({});
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsRows, setProductsRows] = useState([]);
  const [productFields, setProductFields] = useState(initialProductFields);
  const [selectedProduct, setSelectedProduct] = useState(initialProductFields);
 
  // Total CalCulate
  const [totalAmount, setTotalAmount] = useState(fields.total_amount);
  // Grand Total
  const [grandTotal, setGrandTotal] = useState(0);
  // Recovery
  const initialRecoveryFields = {
    party: fields.party,
    sale_officer: fields.sale_officer,
    payment_method: "Cash",
    description: fields.description,
    bank: "",
    amount: "",
  };
  const [recoveryFields, setRecoveryFields] = useState(initialRecoveryFields);
  const [OpenRecovery, setOpenRecovery] = useState(false);
  // Bank
  const [banks, setBanks] = useState([]);
  const [bankTitle, setBankTitle] = useState("Select Bank");
  const [bankDisabled, setBankDisabled] = useState(true);

  async function fetchParties() {
    if (navigator.onLine) {
      return await axiosInstance
        .get("apis/Party/")
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
          } else {
            let parties = data["data"];
            for (let p in parties) {
              parties[p].discount = 0;
              delete parties[p].date;
              delete parties[p].current_Balance;
            }
            setParties(parties);
            localStorage.removeItem("Parties");
            localStorage.setItem("Parties", JSON.stringify(parties));
          }
        })
        .catch((error) => {
          // alert(`Somethin wrong: ${error}`);
        });
    } else {
      setParties(JSON.parse(localStorage.getItem("Parties")));
    }
  }

  async function fetchParoducts() {
    if (navigator.onLine) {
      return await axiosInstance
        .get("apis/Product/")
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
          } else {
            let pdts = data["data"];
            setProducts(pdts);
            localStorage.removeItem("Products");
            localStorage.setItem("Products", JSON.stringify(pdts));
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
    } else {
      setProducts(JSON.parse(localStorage.getItem("Products")));
    }
  }

  async function fetchSalesOfficers() {
    if (navigator.onLine) {
      return await axiosInstance
        .get("apis/SalesOfficer/")
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
          } else {
            var d = data["data"];
            for (let p in d) {
              delete d[p].date;
              delete d[p].current_Balance;
            }
            setSalesOfficers(d);
            localStorage.removeItem("SalesOfficer");
            localStorage.setItem("SalesOfficer", JSON.stringify(d));
          }
        })
        .catch((error) => {
          // alert(`Somethin wrong: ${error}`);
        });
    } else {
      setSalesOfficers(JSON.parse(localStorage.getItem("SalesOfficer")));
    }
  }

  async function fetchBank() {
    if (navigator.onLine) {
      return await axiosInstance
        .get("apis/Bank/")
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
          } else {
            let bank = data["data"];
            for (let b in bank) {
              delete bank[b].date;
              delete bank[b].current_Balance;
            }
            setBanks(bank);
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
    }
  }

  const ProductfieldChange = (e) => {
    setProductFields({
      ...productFields,
      rate: selectedProduct.sales_price,
      [e.target.name]: e.target.value,
    });
  };

  const handleProductRowSubmit = (e) => {
    e.preventDefault();
    const newProductRow = {
      product: productFields.product,
      product_id: selectedProduct.id,
      qty: productFields.qty,
      rate: productFields.rate,
      total: productFields.qty * productFields.rate,
    };
    const newProductsRows = [...productsRows, newProductRow];
    setProductsRows(newProductsRows);
    setProductFields(initialProductFields);
    setSelectedProduct([]);
  };

  const FieldsCahange = (event) => {
    if (event.target.name === "party") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setPartyTitle(obj.name);
    }
    if (event.target.name === "sale_officer") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setSalesOfficerTitle(obj.name);
      setSelectedSalesOfficer(obj.id);
    }
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };
  const handleRecoveryFieldsChange = (event) => {
    setRecoveryFields({
      ...recoveryFields,
      [event.target.name]: event.target.value,
    });
    if (event.target.name === "bank") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setBankTitle(obj.name);
    }
  };
  const handleMenuChange = (event) => {
    setRecoveryFields({
      ...fields,
      payment_method: event.target.value,
    });
    if (event.target.value === "Bank") {
      setBankDisabled(false);
    } else {
      setBankDisabled(true);
    }
  };

  const clearProduct = () => {
    setProductsRows([]);
    setProductFields(initialFields);
    setSelectedProduct([]);
  };

  const handleGenrateOrder = async (e) => {
    let sendfileds = {
      ...fields,
      sale_officer: selectedSalesOfficer,
      ...mapLocations,
      locations: JSON.stringify(locations),
    };
    const send_dict = {
      party_order: sendfileds,
      products: productsRows,
      recovery: { ...recoveryFields },
    };

    await axiosInstance
      .post("apis/GenratePartyOrder/", send_dict)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          let errors = data["message"];
          for (let error in errors) {
            alert(errors[error]);
          }
        } else {
          alert("Order Genrated");
          clearProduct();
          setFields(initialFields);
          setPartyTitle("Select Party");
          setSalesOfficerTitle("Select Sales Officer");
          setRecoveryFields(initialRecoveryFields);
          setOpenRecovery(false);
          setLocations([]);
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
      });
  };
  const productValueChange = (_, value) => {
    if (value !== null) {
      setSelectedProduct(value);
    }
  };
  function checkIsAdmin() {
    let u = localStorage.getItem("salesofficer");
    if (u === "undefined" || u !== null) {
      let so = JSON.parse(u);
      setSalesOfficerDisabled(true);
      setSalesOfficerTitle(so.name);
      setSelectedSalesOfficer(so.id);
    }
  }

  // Map Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setMapLocations({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });
    } else {
      console.log("Not Available");
    }
  }, []);

  useEffect(() => {
    fetchParties();
    fetchSalesOfficers();
    fetchParoducts();
    checkIsAdmin();
  }, []);
  // Total Calculater
  useEffect(() => {
    var count = 0;
    var total_qty = 0;
    var total_rate = 0;
    for (let row in productsRows) {
      count += productsRows[row].total;
      total_qty += productsRows[row].qty;
      total_rate += productsRows[row].rate;
    }
    setTotalAmount(count);
    var grand_total = 0;
    grand_total = count;
    grand_total = grand_total - fields.freight;
    setGrandTotal(grand_total);

    setFields({
      ...fields,
      total_qty: total_qty,
      total_rate: total_rate,
      total_amount: grand_total,
      gross_total: totalAmount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsRows, fields.freight]);

  return (
    <div >
      <Paper elevation={3} className={classes.formRoot}>
        {/* Genrate Order */}
        <Grid
          container
          spacing={2}
          className={`${classes.formRoot} ${classes.gultter}`}
        >
          {/* TITLE */}
          <Grid item xs={12}>
            <Typography variant="body2" color="primary">
              Genrate Party Order{" "}
            </Typography>
          </Grid>
          {/* Left CONTAINER */}
          <Grid item xs={12} md={8} container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="button" color="textSecondary">
                Party{" "}
              </Typography>
              <Selecter
                title={partyTitle}
                handleChange={FieldsCahange}
                value={fields.party}
                onOpen={() => ""}
                choises={parties}
                name="party"
                algin="left"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="button" color="textSecondary">
                Description{" "}
              </Typography>
              <br />
              <TextareaAutosize
                value={fields.description}
                onChange={FieldsCahange}
                name="description"
                placeholder="Enter Order Discription"
                maxRows={12}
                className={classes.textArea}
              />
            </Grid>
          </Grid>
          {/* Right CONATINER */}
          <Grid item xs={12} md={4} container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="button" color="textSecondary">
                SALES OFFICER{" "}
              </Typography>
              <Selecter
                title={salesOfficerTitle}
                disabled={salesOfficerDisabled}
                handleChange={FieldsCahange}
                value={fields.sale_officer}
                onOpen={() => ""}
                choises={salesOfficers}
                name="sale_officer"
              />
            </Grid>
            {/* Total  */}
            <Grid
              item
              xs={12}
              container
              className={classes.textArea}
              alignContent="center"
            >
              <Grid item xs={12}>
                <InputField
                  size="small"
                  label="Total Freight"
                  type="number"
                  onChange={FieldsCahange}
                  name="freight"
                  value={fields.freight}
                />
              </Grid>
              <Grid item container justifyContent="space-between">
                <Typography variant="subtitle2" color="secondary">
                  Total Amount <b>:</b>
                </Typography>
                <Typography variant="subtitle2" color="secondary">
                  {totalAmount}
                </Typography>
              </Grid>
              <Grid item container justifyContent="space-between">
                <Typography variant="subtitle2" color="textPrimary">
                  Grand Total <b>:</b>
                </Typography>
                <Typography variant="subtitle2" color="textPrimary">
                  {grandTotal}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<ReceiptIcon />}
                onClick={() => setOpenRecovery(true)}
              >
                Generate Order
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Divider variant="middle" className={classes.gultter} />
        {/* Add Products */}
        <Grid
          container
          spacing={2}
          className={`${classes.formRoot} ${classes.gultter}`}
        >
          <Grid
            container
            justifyContent="space-around"
            className={classes.bgBlue}
          >
            <Grid item>
              <Typography
                variant="button"
                className={classes.white}
                align="center"
              >
                Product
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="button"
                className={classes.white}
                align="center"
              >
                Quantity
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="button"
                className={classes.white}
                align="center"
              >
                Rate
              </Typography>
            </Grid>
          </Grid>
          {/* Add Product */}
          <form
            style={{ display: "contents" }}
            onSubmit={handleProductRowSubmit}
          >
            <Grid
              container
              justifyContent="space-around"
              style={{ marginTop: "20px" }}
              spacing={3}
            >
              {/* Product */}
              <Grid item>
                <AutoSuggestField
                  options={products}
                  selectedOption={(option) => {
                    return option.name;
                  }}
                  label={"Select Product"}
                  id={"id"}
                  value={selectedProduct}
                  valueChange={productValueChange}
                  name="product"
                  required={true}
                  onChange={ProductfieldChange}
                />
              </Grid>
              {/* Qty */}
              <Grid item>
                <InputField
                  size="small"
                  label="Qty"
                  type="number"
                  required={true}
                  onChange={ProductfieldChange}
                  name="qty"
                  value={productFields.qty}
                />
              </Grid>
              {/* Rate */}
              <Grid item>
                <InputField
                  size="small"
                  label="Rate"
                  type="number"
                  required={true}
                  onChange={ProductfieldChange}
                  name="rate"
                  value={productFields.rate}
                />
              </Grid>
              {/* Submit */}
              <Grid
                container
                justifyContent="flex-start"
                item
                xs={12}
                spacing={2}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    type="submit"
                    className={classes.xsFull}
                  >
                    Add Product
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.xsFull}
                    onClick={clearProduct}
                  >
                    Clear Product
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Paper>
      {/* Product Table */}
      <Grid container>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow key="products">
                <StyledTableCell key="name">Product</StyledTableCell>
                <StyledTableCell key="quantity">Quantity</StyledTableCell>
                <StyledTableCell key="rate">Rate</StyledTableCell>
                <StyledTableCell key="total">Total</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.product}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                  <TableCell>{row.rate}</TableCell>
                  <TableCell>{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* Recovery Model */}
      <Dialog open={OpenRecovery} onClose={() => setOpenRecovery(false)}>
        <DialogTitle id="Dialog">Add Recovery</DialogTitle>
        <DialogContent>
          <Typography color="secondary">
            Leave Empty or 0 if you dont want to add Recovery
          </Typography>
          <DialogContentText id="DialogText">
            <Grid container justifyContent="center">
              {/* Payment Method */}
              <Grid item xs={12}>
                <MenuItems
                  options={["Cash", "Clearing", "Bank"]}
                  title="Payment Method"
                  handleChange={handleMenuChange}
                  selectedOption={recoveryFields.payment_method}
                />
              </Grid>
              <Grid item xs>
                <Selecter
                  title={bankTitle}
                  handleChange={handleRecoveryFieldsChange}
                  value={recoveryFields.bank}
                  onOpen={fetchBank}
                  choises={banks}
                  name="bank"
                  disabled={bankDisabled}
                />
              </Grid>
              <Grid item>
                <InputField
                  size="small"
                  label="Recovery Amount"
                  type="number"
                  fullWidth
                  onChange={handleRecoveryFieldsChange}
                  name="amount"
                  value={recoveryFields.amount}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRecovery(false)} color="default">
            Cancel
          </Button>
          <Button onClick={handleGenrateOrder} color="secondary" autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
