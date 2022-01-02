import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import Selecter from "../../components/Selecter";
import axiosInstance from "../../apisConfig";
import InputField from "../../components/InputField";
import SpineerButton from "../../components/SpineerButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import CachedIcon from "@material-ui/icons/Cached";
import DeleteIcon from "@material-ui/icons/Delete";
import { DataGrid } from "@material-ui/data-grid";
import AutoSuggestField from "../../components/AutoSuggestField";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  formRoot: {
    marginRight: theme.spacing(-8),
  },

  dataGrid: {
    "& .MuiDataGrid-columnsContainer": {
      backgroundColor: theme.palette.primary.dark,
    },
    "& .status-color-for--Pending": {
      backgroundColor: "#e0d6ff",
    },
    "& .status-color-for--Approved": {
      backgroundColor: "#08d0fd",
    },
    "& .status-color-for--Delivered": {
      backgroundColor: "#ce7e00",
    },
    "& .status-color-for--Verified": {
      backgroundColor: "#c2f351",
    },
  },
  tableProductsTotal: {
    backgroundColor: theme.palette.primary.light,
  },
  divider: {
    "@media only screen and (max-width: 600px)": {
      display: "none",
    },
  },
  textArea: {
    width: "100%",
    minWidth: "100px",
    maxWidth: "100%",
    minHeight: "80px",
    maxHeight: "200px",
    fontSize: "18px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
  },
  productTable: {
    height: "320px",
    overflowY: "auto",
  },
  colorDark: {
    color: theme.palette.primary.dark,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}))(TableCell);
var selectedPartyOrders = [];
const Purchases = () => {
  const initialFields = {
    supplier: "",
    vehical: "",
    description: "",
    freight: "",
    total_qty: "",
    total_rate: "",
    total_amount: "",
    gross_total: "",
    discounted_amount: 0,
  };

  const classes = useStyles();
  const [rows, setRows] = useState([]);

  const [vehicals, setVehicals] = useState([]);
  const [vehicalsTitle, setVehicalTitle] = useState("Vehical");

  const [fields, setFields] = useState(initialFields);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [supplierTitle, setSuppliersTitle] = useState("Suppiler");
  const [selectedObj, setSelectedObj] = useState([]);
  // Products
  const initialProductFields = {
    product: "",
    qty: "",
    rate: "",
    freight: 0,
  };
  const [products, setProducts] = useState([]);
  const [productsQtyTotal, setProductsQtyTotal] = useState(0);
  const [productsRateTotal, setProductsRateTotal] = useState(0);
  const [productsTotal, setProductsTotal] = useState(0);
  const [productsRows, setProductsRows] = useState([]);
  const [productFields, setProductFields] = useState(initialProductFields);
  const [selectedProduct, setSelectedProduct] = useState(initialProductFields);
  // Dispatch
  let date = new Date();
  const LedgersTitle = [
    "Party",
    "SalesOfficer",
    "Suppliers",
    "Vehicals",
    "Bank",
    "Sales",
    "Cash",
  ];
  const initialDispatchFields = {
    freight: "",
    vehical: "",
    vehical_running:"",
    party_order: "",
    delivery_date:
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    freight_cr: "",
    freight_cr_type: "",
    freight_cr_header: null,
    freight_dr: "",
    freight_dr_type: "",
    freight_dr_header: null,
  };
  const [dispatchFields, setDispatchFields] = useState(initialDispatchFields);
  const [dispatchBox, setDispatchBox] = useState(false);
  const [partyOrders, setPartyOrders] = useState([]);
  const [selectedQty, setSelectedQty] = useState(0);
  const [dispatchSelection, setDispatchSelection] = useState(false);
  // Charge Freight
  const [chargeFreightBox, setChargeFreightBox] = useState(false);
  // Frieght Debit
  const [fDHeaders, setFDHeaders] = useState([]);
  const [fDHeaderTitle, setFDHeaderTitle] = useState("Headers");
  const [fDDiabledHeader, setFDDisabledHeader] = useState(true);
  const [fDTypeOpen, setFDTypeOpen] = useState(false);
  // Frieght Crdit
  const [fCHeaders, setFCHeaders] = useState([]);
  const [fCHeaderTitle, setFCHeaderTitle] = useState("Headers");
  const [fCDiabledHeader, setFCDisabledHeader] = useState(true);
  const [isStock, setIsStock] = useState(false);
  const [fCTypeOpen, setFCTypeOpen] = useState(false);

  const TypeChange = (e, type) => {
    let v = e.target.value;
    if (v !== "Cash" && v !== "Sales") {
      FetchLgReleventHeader(e.target.value, type);
    } else {
      if (type === "FD") {
        setFDHeaderTitle("Header");
        setFDDisabledHeader(true);
      } else {
        setFCHeaderTitle("Header");
        setFCDisabledHeader(true);
      }
    }
    if (type === "FD") {
      setDispatchFields({ ...dispatchFields, freight_dr_type: e.target.value });
    } else {
      setDispatchFields({ ...dispatchFields, freight_cr_type: e.target.value });
    }
  };

  async function FetchLgReleventHeader(type, head) {
    return await axiosInstance
      .get(`apis/${type}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let headers = data["data"];
          for (let h in headers) {
            delete headers[h].date;
            delete headers[h].current_Balance;
            if (type === "Vehicals") {
              headers[h].name = headers[h].vehical_no;
            }
          }
          if (head === "FC") {
            setFCHeaders(headers);
            setFCHeaderTitle("Header");
            setFCDisabledHeader(false);
          } else {
            setFDHeaderTitle("Header");
            setFDHeaders(headers);
            setFDDisabledHeader(false);
          }
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  const HandleDispatchFields = (event, type) => {
    if (event.target.name === "freight_dr_header") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setFDHeaderTitle(obj.name);
    } else if (event.target.name === "freight_cr_header") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setFCHeaderTitle(obj.name);
    } else if (event.target.name === "vehical") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setVehicalTitle(obj.vehical_no);
    } else if (event.target.name === "sale_officer") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setVehicalTitle(obj.name);
    }
    setDispatchFields({
      ...dispatchFields,
      [event.target.name]: event.target.value,
    });
  };
  const handleDateChange = (date) => {
    var d =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    setDispatchFields({
      ...dispatchFields,
      delivery_date: String(d),
    });
  };

  async function fetchSuppliers() {
    return await axiosInstance
      .get("apis/Suppliers/")
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
          setSuppliers(d);
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
      });
  }

  async function fetchPurchases() {
    return await axiosInstance
      .get("apis/Purchase/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          alert(`Error Occures ${data["message"]}`);
        } else {
          let Purchases = data["data"];
          for (let p in Purchases) {
            delete Purchases[p].current_Balance;
            Purchases[p].supplier = Purchases[p].supplier.name;
            Purchases[p].vehical = Purchases[p].vehical.driver_name;
          }
          setRows(Purchases);
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
      });
  }

  async function fetchPartyOrders(qty) {
    await axiosInstance
      .get("apis/PartyOrderConfirmed/")
      .then((res) => {
        if (res["error"] === true) {
          alert(`Error Occures ${res["message"]}`);
        } else {
          var d = res["data"]["data"];
          for (let order in d) {
            if (d[order].total_qty > qty) {
              delete d[order];
            } else {
              d[order].party = d[order].party.name;
              d[order].sale_officer = d[order].sale_officer.name;
            }
          }
          setPartyOrders(d);
          setLoading(false);
          setDispatchSelection(false);
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
      });
  }

  async function fetchVehicals() {
    return await axiosInstance
      .get("apis/Vehicals/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          alert(`Error Occures ${data["message"]}`);
        } else {
          for (let d in data.data) {
            data.data[d].name = data.data[d].driver_name;
            data.data[d].discount = data.data[d].vehical_no;
          }
          setVehicals(data.data);
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
      });
  }

  function CalculateProductsTotal() {
    let total_qty = 0;
    let total_rate = 0;
    let total = 0;
    for (let p in productsRows) {
      total_qty = total_qty + parseInt(productsRows[p].qty);
      total_rate = total_rate + parseInt(productsRows[p].rate);
      total = total + parseInt(productsRows[p].total);
    }
    setProductsQtyTotal(total_qty);
    setProductsRateTotal(total_rate);
    setProductsTotal(total);
  }

  function Reset() {
    fetchPurchases();
    setSuppliersTitle("Supplier");
    setVehicalTitle("Vehical");
    setFields(initialFields);
    setProductFields(initialProductFields);
    setLoading(false);
    setSuccess(false);
    setIsUpdate(false);
    setProductsRows([]);
  }
  const handleClose = () => {
    setOpenDialog(false);
  };
  async function savePurchase() {
    if (productsRows.length < 1) {
      alert("Add Products Fisrt");
      setLoading(false);
      return;
    }
    if (!isUpdate) {
      let send_dict = {
        ...fields,
        total_qty: productsQtyTotal,
        total_rate: productsRateTotal,
        total: productsRateTotal,
        gross_total: productsTotal,
        total_amount:
          productsTotal - (fields.freight - fields.discounted_amount),
        products: productsRows,
      };
      return await axiosInstance
        .post("apis/Purchase/", send_dict)
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
            Reset();
          } else {
            setLoading(false);
            Reset();
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
          Reset();
        });
    } else {
      let send_dict = {
        ...fields,
        total_qty: productsQtyTotal,
        total_rate: productsRateTotal,
        total: productsRateTotal,
        gross_total: productsTotal,
        total_amount:
          productsTotal - (fields.freight - fields.discounted_amount),
        products: productsRows,
      };
      return await axiosInstance
        .put(`apis/Purchase/${selectedObj.id}/`, send_dict)
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
            Reset();
          } else {
            Reset();
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
          Reset();
        });
    }
  }

  async function ConfirmDelete() {
    return await axiosInstance
      .delete(`apis/Purchase/${selectedObj.id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          alert(`Error Occures ${data["message"]}`);
        } else {
          Reset();
          setOpenDialog(false);
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
        setOpenDialog(false);
        Reset();
      });
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
  async function GetPurchaseForUpdate(id = selectedObj.id) {
    return await axiosInstance
      .get(`apis/Purchase/${id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          alert(`Error Occures ${data["message"]}`);
        } else {
          let setData = {
            total_qty: data.data.total_qty,
            total_rate: data.data.total_rate,
            freight: data.data.freight,
            description: data.data.description,
            supplier: data.data.supplier.id,
            vehical: data.data.vehical.id,
            gross_total: data.data.gross_total,
            discounted_amount: data.data.discounted_amount,
          };
          let pdts = data.data.products;
          setProductsRows([]);
          let pdts_list = [];
          for (let p in pdts) {
            pdts_list.push({
              product: pdts[p].product.id,
              qty: pdts[p].qty,
              rate: pdts[p].rate,
              total: pdts[p].qty + pdts[p].rate,
            });
          }
          setProductsRows(pdts_list);
          setFields(setData);
          setSuppliersTitle(data.data.supplier.name);
          setVehicalTitle(data.data.vehical.driver_name);
          setIsUpdate(true);
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
        setSuccess(false);
        setLoading(false);
      });
  }
  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      savePurchase();
    }
  };
  const FiledChange = (event) => {
    if (event.target.name === "supplier") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setSuppliersTitle(obj.name);
    }
    if (event.target.name === "vehical") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setVehicalTitle(obj.name);
    }
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };
  const UpdatePurchase = (obj) => {
    setSelectedObj(obj);
    GetPurchaseForUpdate(obj.id);
  };
  async function UpdatePurchaseStatus(id) {
    return await axiosInstance
      .get(`apis/UpdatePurchaseStatus/${id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          alert(`Error Occures ${data["message"]}`);
        } else {
          fetchPurchases();
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
      });
  }
  function ResetDiaptch() {
    setDispatchSelection(false);
    setDispatchBox(false);
    setChargeFreightBox(false);
    setDispatchFields(initialDispatchFields);
    selectedPartyOrders = [];
    setFields(initialFields);
    fetchPurchases();
    setFCDisabledHeader(true);
    setFCHeaders([]);
    setFDDisabledHeader(true);
    setFDHeaders([]);
    setVehicalTitle("Vehical");
  }
  async function DispatchPurchase() {
    const send_dict = {
      PartyOrders: selectedPartyOrders,
      PurchaseID: selectedObj.id,
      Qty: selectedQty,
      isStock: isStock,
      dispatch: dispatchFields,
    };
    console.log(send_dict);
    return await axiosInstance
      .post(`apis/DispatchPurchase/`, send_dict)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          let errors = data["message"]
          for (let err in errors){
            toast.error(`${err} - ${errors[err]}`);
          }
        } else {
          ResetDiaptch();
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
        ResetDiaptch();
      });
  }

  const handleDispatch = (row) => {
    setDispatchBox(true);
    setSelectedObj(row.row);
    fetchPartyOrders(row.row.remaining_qty);
  };

  const columns = [
    { field: "id", headerName: "Sr#" },
    // info
    { field: "description", headerName: "description", width: 200 },
    { field: "total_qty", headerName: "Total Qty", width: 200 },
    { field: "remaining_qty", headerName: "Remaining QTY", width: 200 },
    { field: "total_rate", headerName: "Rate", width: 200 },
    { field: "gross_total", headerName: "Gross Total", width: 200 },
    { field: "discounted_amount", headerName: "Discounted Amount", width: 200 },
    { field: "freight", headerName: "Freight", width: 200 },
    // Attachments
    { field: "supplier", headerName: "Supplier", width: 200 },
    { field: "vehical", headerName: "vehical", width: 200 },
    { field: "status", headerName: "Status", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      headerAlign: "center",
      editable: false,
      renderCell: (row) => (
        <Grid container>
          {row.row.status === "Pending" ? (
            <Grid item>
              <IconButton onClick={() => UpdatePurchaseStatus(row.row.id)}>
                <DoneIcon color="secondary" />
              </IconButton>
            </Grid>
          ) : (
            <>
              {row.row.status === "Approved" ? (
                <Grid item>
                  <IconButton onClick={() => UpdatePurchaseStatus(row.row.id)}>
                    <DoneAllIcon color="secondary" />
                  </IconButton>
                </Grid>
              ) : (
                <>
                  {row.row.status === "Verified" ? (
                    <Grid item>
                      <IconButton disabled>
                        <ThumbUpIcon color="secondary" />
                      </IconButton>
                    </Grid>
                  ) : undefined}
                </>
              )}
            </>
          )}
          {row.row.status !== "Pending" ? (
            <Grid item>
              {row.row.remaining_qty > 0 ? (
                <IconButton
                  onClick={() => {
                    handleDispatch(row);
                  }}
                >
                  <LocalShippingIcon color="primary" />
                </IconButton>
              ) : (
                <IconButton disabled>
                  <LocalShippingIcon disabled />
                </IconButton>
              )}
            </Grid>
          ) : undefined}
          <Grid item>
            <IconButton
              onClick={() => {
                UpdatePurchase(row);
              }}
            >
              <EditIcon color="primary" />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => {
                setSelectedObj(row);
                setOpenDialog(true);
              }}
            >
              <DeleteIcon color="secondary" />
            </IconButton>
          </Grid>
        </Grid>
      ),
    },
  ];
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
      product: selectedProduct.id,
      qty: productFields.qty,
      rate: productFields.rate,
      total: productFields.qty * productFields.rate,
    };
    let old_array = productsRows.filter(
      (val, id, index) => val.product !== selectedProduct.id
    );
    const newProductsRows = [...old_array, newProductRow];
    setProductsRows(newProductsRows);
    setProductFields(initialProductFields);
    setSelectedProduct([]);
  };
  const productValueChange = (_, value) => {
    if (value !== null) {
      setSelectedProduct(value);
    }
  };
  const clearProduct = () => {
    setProductsRows([]);
    setProductFields(initialFields);
    setSelectedProduct([]);
  };
  const HandleOrderSelect = (e, row) => {
    let qty = 0;
    if (e.target.checked === true) {
      qty = selectedQty + row.total_qty;
      setSelectedQty(qty);
      selectedPartyOrders.push(row.id);
    } else {
      selectedPartyOrders = selectedPartyOrders.filter((id) => id !== row.id);
      qty = selectedQty - row.total_qty;
      setSelectedQty(qty);
    }
    if (qty >= selectedObj.remaining_qty) {
      setDispatchSelection(true);
    } else {
      setDispatchSelection(false);
    }
  };
  const handleStockChecked = (e) => {
    let checked = e.target.checked;
    setIsStock(checked);
    if (!checked) {
      setSelectedQty(0);
      fetchPartyOrders(selectedObj.remaining_qty);
    } else {
      setSelectedQty(0);
      setPartyOrders([]);
    }
  };
  const handleStockQtyChange = (e) => {
    setSelectedQty(e.target.value);
  };
  useEffect(() => {
    fetchPurchases();
    fetchParoducts();
  }, []);
  useEffect(() => {
    CalculateProductsTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsRows]);

  return (
    <Grid container spacing={2} className={classes.formRoot}>
      {/* Title */}
      <Grid item xs={10} md={11}>
        <Typography variant="h4" gutterBottom color="primary">
          Purchase Inventory
        </Typography>
      </Grid>
      <Grid item xs={2} md={1}>
        <Button onClick={fetchPurchases}>
          <CachedIcon></CachedIcon>
        </Button>
      </Grid>
      {/* Left */}
      <Grid item xs={12} md={3}>
        {/* left */}
        <Grid container item spacing={2}>
          <Grid item xs={6}>
            <Selecter
              title={supplierTitle}
              handleChange={FiledChange}
              value={fields.supplier}
              onOpen={fetchSuppliers}
              choises={suppliers}
              name="supplier"
              fw={true}
            />
          </Grid>
          <Grid item xs={6}>
            <Selecter
              fw={true}
              title={vehicalsTitle}
              handleChange={FiledChange}
              value={fields.vehical}
              onOpen={fetchVehicals}
              choises={vehicals}
              name="vehical"
            />
          </Grid>
          <Grid item xs={12}>
            <textarea
              className={classes.textArea}
              value={fields.description}
              onChange={FiledChange}
              name="description"
            ></textarea>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="caption" color="secondary">
                QTY Total: <br />
                <b>{productsQtyTotal}</b>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="secondary">
                Rate Total: <br />
                <b>{productsRateTotal}</b>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="secondary">
                Gross Total: <br />
                <b>{productsTotal}</b>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                GrandTotal:{" "}
                <b className={classes.colorDark}>
                  {productsTotal - fields.freight - fields.discounted_amount}
                </b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <InputField
                label="Discount Amount"
                type="number"
                size="small"
                name="discounted_amount"
                required={true}
                value={fields.discounted_amount}
                onChange={FiledChange}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                label="Freight"
                type="number"
                size="small"
                name="freight"
                fullWidth
                required={true}
                value={fields.freight}
                onChange={FiledChange}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <SpineerButton
              handleButtonClick={handleButtonClick}
              label={isUpdate ? "Update" : "Save"}
              loading={loading}
              success={success}
              fw={true}
              size="large"
              startIcon={isUpdate ? <EditIcon /> : <AddBoxOutlinedIcon />}
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider orientation="vertical" flexItem className={classes.divider} />
      {/* Right Products */}
      <Grid item container xs={12} md={9} spacing={1}>
        <Grid item container>
          {/* Add Product */}
          <form
            style={{ display: "contents" }}
            onSubmit={handleProductRowSubmit}
          >
            <Grid item container spacing={2}>
              {/* Product */}
              <Grid item xs={12} md={4}>
                <AutoSuggestField
                  fw={true}
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
              <Grid item xs={6} md={2}>
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
              <Grid item xs={6} md={2}>
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
              <Grid item x={6} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  type="submit"
                >
                  Add Product
                </Button>
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  color="secondary"
                  size="small"
                  onClick={clearProduct}
                >
                  Clear Product
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        {/* Product Table */}
        <Grid item xs={12} className={classes.productTable}>
          <TableContainer component={Paper}>
            <Table aria-label="Product table">
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
                <TableRow key={"Total"} className={classes.tableProductsTotal}>
                  <TableCell>
                    <b>Total</b>
                  </TableCell>
                  <TableCell>{productsQtyTotal}</TableCell>
                  <TableCell>{productsRateTotal}</TableCell>
                  <TableCell>{productsTotal}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {/* Purchases */}
      <Grid item container xs={12}>
        <Grid item xs={12}>
          <DataGrid
            rows={rows}
            columns={columns}
            className={classes.dataGrid}
            getRowClassName={(params) =>
              `status-color-for--${params.getValue(params.id, "status")}`
            }
            autoPageSize
            autoHeight
            disableSelectionOnClick
            loading={loading}
          />
        </Grid>
      </Grid>
      {/* // Model */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to Delete {selectedObj.id}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">
            No
          </Button>
          <Button onClick={ConfirmDelete} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dispatch */}
      <Dialog
        open={dispatchBox}
        onClose={() => {
          setDispatchBox(false);
        }}
      >
        <DialogTitle id="dispatchBox">Orders Dispatching</DialogTitle>
        <DialogContent>
          <DialogContentText id="dispatchBox">
            Select <b>PartyOrder</b> you want to be Dispatched
            <br />
            <span>
              Aail :{" "}
              <Typography color="secondary" component="span">
                {selectedObj.remaining_qty}
              </Typography>{" "}
              - Selected :{" "}
              <Typography color="secondary" component="span">
                {selectedQty}
              </Typography>
            </span>
          </DialogContentText>
          {/* Party Orders */}
          <Grid container spacing={2}>
            <Grid item>
              <Checkbox
                checked={isStock}
                onChange={handleStockChecked}
                size="small"
              />
            </Grid>
            <Grid item>
              <InputField
                label="Quantity"
                type="number"
                size="small"
                name="qty"
                disabled={!isStock}
                required={true}
                value={selectedQty}
                onChange={handleStockQtyChange}
              />
            </Grid>
            {/* Party orders */}
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table
                  className={classes.table}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Order id</TableCell>
                      <TableCell align="right">Party</TableCell>
                      <TableCell align="right">Officer</TableCell>
                      <TableCell align="right">Qty</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {partyOrders.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Checkbox
                            disabled={dispatchSelection}
                            onChange={(e) => HandleOrderSelect(e, row)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{row.id}</TableCell>
                        <TableCell align="right">{row.party}</TableCell>
                        <TableCell align="right">{row.sale_officer}</TableCell>
                        <TableCell align="right">{row.total_qty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDispatchBox(false);
            }}
            color="default"
          >
            Close
          </Button>
          <Button onClick={() => setChargeFreightBox(true)} color="secondary">
            Dispatch
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dispatch Charge Freight */}
      <Dialog
        open={chargeFreightBox}
        onClose={() => setChargeFreightBox(!chargeFreightBox)}
      >
        <DialogTitle>{"Dispatch Details"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Dispatch with</DialogContentText>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item xs={6} md={4}>
              <Selecter
                name="vehical"
                fw={true}
                title={vehicalsTitle}
                handleChange={HandleDispatchFields}
                value={dispatchFields.vehical}
                onOpen={fetchVehicals}
                choises={vehicals}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <InputField
                label="Freight"
                size="small"
                name="freight"
                type="string"
                value={dispatchFields.freight}
                onChange={HandleDispatchFields}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <InputField
                label="Vehical Running"
                size="small"
                name="vehical_running"
                type="number"
                value={dispatchFields.vehical_running}
                onChange={HandleDispatchFields}
              />
            </Grid>
            <Grid item xs={12} >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  fullWidth
                  format="yyyy-MM-dd"
                  id="FromDate"
                  name="delivery_date"
                  value={dispatchFields.delivery_date}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{ "aria-label": "Select Delivery Date" }}
                />
              </MuiPickersUtilsProvider>
            </Grid>

            <Grid item container spacing={3} justifyContent="center">
              <Grid xs={12} item>
                <Typography>Freight Debit</Typography>
              </Grid>

              <Grid item xs={6} md={4}>
                <FormControl className={classes.TypeSelecter} fullWidth>
                  <InputLabel>Ledger Type</InputLabel>
                  <Select
                    open={fDTypeOpen}
                    onClose={() => setFDTypeOpen(false)}
                    onOpen={() => setFDTypeOpen(true)}
                    onChange={(e) => TypeChange(e, "FD")}
                    value={dispatchFields.freight_dr_type}
                    required
                  >
                    {LedgersTitle.map((lg) => (
                      <MenuItem key={lg} value={lg}>
                        {lg}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={4}>
                <Selecter
                  fw={true}
                  name="freight_dr_header"
                  title={fDHeaderTitle}
                  disabled={fDDiabledHeader}
                  handleChange={HandleDispatchFields}
                  value={dispatchFields.freight_dr_header}
                  onOpen={() => {}}
                  choises={fDHeaders}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InputField
                  fullWidth
                  label="Freight Dr"
                  size="small"
                  name="freight_dr"
                  type="string"
                  value={dispatchFields.freight_dr}
                  onChange={HandleDispatchFields}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={3} justifyContent="center">
              <Grid xs={12} item>
                <Typography>Freight Credit</Typography>
              </Grid>

              <Grid item xs={6} md={4}>
                <FormControl className={classes.TypeSelecter} fullWidth>
                  <InputLabel>Ledger Type</InputLabel>
                  <Select
                    open={fCTypeOpen}
                    onClose={() => setFCTypeOpen(false)}
                    onOpen={() => setFCTypeOpen(true)}
                    onChange={(e) => TypeChange(e, "FC")}
                    value={dispatchFields.freight_cr_type}
                    required
                  >
                    {LedgersTitle.map((lg) => (
                      <MenuItem key={lg} value={lg}>
                        {lg}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={4}>
                <Selecter
                  fw={true}
                  name="freight_cr_header"
                  title={fCHeaderTitle}
                  disabled={fCDiabledHeader}
                  handleChange={HandleDispatchFields}
                  value={dispatchFields.freight_cr_header}
                  onOpen={() => {}}
                  choises={fCHeaders}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InputField
                  fullWidth
                  label="Freight Cr"
                  size="small"
                  name="freight_cr"
                  type="string"
                  value={dispatchFields.freight_cr}
                  onChange={HandleDispatchFields}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDispatchFields(initialDispatchFields);
              setChargeFreightBox(false);
            }}
            color="default"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              DispatchPurchase();
              setChargeFreightBox(true);
            }}
            color="primary"
            autoFocus
          >
            {loading ? <CircularProgress color="secondary" /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Purchases;
