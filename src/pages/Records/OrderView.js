import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import axiosInstance from "../../apisConfig";
import { makeStyles } from "@material-ui/styles";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import AddAlarmOutlinedIcon from "@material-ui/icons/AddAlarmOutlined";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import InputField from "../../components/InputField";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import EditIcon from "@material-ui/icons/Edit";
import Selecter from "../../components/Selecter";
import DeleteIcon from "@material-ui/icons/Delete";
import { connect } from "react-redux";
import GroupStatus from "../../utils/status";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AutoSuggestField from "../../components/AutoSuggestField";
import CachedIcon from "@material-ui/icons/Cached";
import PictureAsPdfOutlinedIcon from "@material-ui/icons/PictureAsPdfOutlined";
import logo from "../../static/img/logo.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(3),
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: theme.palette.primary.dark,
      cursor: "pointer",
    },
  },
  pdf: {
    minWidth: "300px",
  },
  xsInput: {
    width: "150px",
    "& .MuiFormControl-root": {
      "@media only screen and (max-width: 600px)": {
        width: "70px",
      },
    },
  },
  TypeSelecter: {
    bottom: "10px",
  },
}));

function DataTable(props) {
  const initialEditFields = {
    party: "",
    sale_officer: "",
    description: "",
    freight: "",
    total_amount: "",
    discount: "",
  };
  var date = new Date();
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

  const LedgersTitle = [
    "Party",
    "SalesOfficer",
    "Suppliers",
    "Vehicals",
    "Bank",
    "Sales",
    "Cash",
  ];
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState(initialDispatchFields);
  const [editFields, setEditFields] = useState(initialEditFields);
  // Dispatch
  const [dispatchFields, setDispatchFields] = useState(initialDispatchFields);
  const [fCTypeOpen, setFCTypeOpen] = useState(false);
  const [fCHeaders, setFCHeaders] = useState([]);
  const [fCHeaderTitle, setFCHeaderTitle] = useState("Header");
  const [fCDiabledHeader, setFCDisabledHeader] = useState(true);
  const [fDTypeOpen, setFDTypeOpen] = useState(false);
  const [fDHeaders, setFDHeaders] = useState([]);
  const [fDHeaderTitle, setFDHeaderTitle] = useState("Headers");
  const [fDDiabledHeader, setFDDisabledHeader] = useState(true);
  const [openEditDialog, setEditDialog] = useState(false);
  const [isUpdate, setisUpdate] = useState(false);
  // Vehical
  const [vehicals, setVehicals] = useState([]);
  const [vehicalTitle, setVehicalTitle] = useState("Vehical");

  // party Order
  const [openDialog3, setOpenDialog3] = useState(false);
  const [selectedPartyOrder, setSelectedPartyOrder] = useState(0);
  const [confirmOrderOpenDialog, setConfirmOrderOpenDialog] = useState(false);
  // party
  const [partyTitle, setPartyTitle] = useState("");
  const [parties, setParties] = useState([]);
  const [partyDisabled, setPartDisabled] = useState(false);
  // Sales Officer
  const [salesOfficer, setSalesOfficer] = useState([]);
  const [salesOfficerTitle, setSalesOfficerTitle] = useState("Sales Officer");
  const [salesOfficerDisabled, setSalesOfficerDisabled] = useState(false);
  // Products
  const [products, setProducts] = useState([]);
  const [prodcutsFetched, setProdcutsFetched] = useState([]);
  const initialProductFields = {
    qty: "",
    rate: "",
    product: "",
    party_order: "",
  };
  const [productsFields, setProductsFields] = useState(initialProductFields);
  const [selectedProduct, setSelectedProduct] = useState(initialProductFields);
  const [confirmProductAdd, setConfirmProductAdd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [selectedObjId, setSelectedObjId] = useState(0);
  const [invoiceDialogBox, setInvoiceDialogBox] = useState(false);
  const [invoiceGenrate, setInvoiceGenrate] = useState(false);
  // Dispatch Details

  const classes = useStyles();

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
      setVehicalTitle(obj.name);
    }
    setDispatchFields({
      ...dispatchFields,
      [event.target.name]: event.target.value,
    });
  };

  const FieldsCahange = (e) => {
    setEditFields({
      ...editFields,
      [e.target.name]: e.target.value,
    });
  };

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
              parties[p].discount = parties[p].discount.discount;
              delete parties[p].date;
              delete parties[p].current_Balance;
            }
            setParties(parties);
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
    }
  }
  async function fetchVehicals() {
    if (navigator.onLine) {
      return await axiosInstance
        .get("apis/Vehicals/")
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            toast.error(`Error Occures ${data["message"]}`);
          } else {
            let v = data["data"];
            for (let i in v) {
              v[i].name = `${v[i].driver_name} (${v[i].vehical_no})`;
            }
            setVehicals(v);
          }
        })
        .catch((error) => {
          toast.error(`Somethin wrong: ${error}`);
        });
    }
  }

  async function fetchReliventPartyOrders(id) {
    if (navigator.onLine) {
      return await axiosInstance
        .get(`apis/PartyOrder/${id}`)
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            let errors = data["message"];
            for (let err in errors) {
              toast.error(`${err} ${errors[err]}`);
            }
          } else {
            let partyorder = data["data"];
            setPartyTitle(partyorder.party.name);
            setSalesOfficerTitle(partyorder.sale_officer.name);
            setEditFields({
              party: partyorder.party.id,
              sale_officer: partyorder.sale_officer.id,
              description: partyorder.description,
              freight: partyorder.freight,
              region: partyorder.region,
              contact: partyorder.contact,
              salesTarget: partyorder.salesTarget,
              total_amount: partyorder.total_amount,
            });
            if (partyorder.status !== "Pending") {
              setPartDisabled(true);
              setSalesOfficerDisabled(true);
            }
            setProducts(partyorder.products);
          }
        })
        .catch((error) => {
          toast.error(`Somethin wrong: ${error}`);
        });
    }
  }

  async function ConfirmOrderDelete() {
    if (navigator.onLine) {
      return await axiosInstance
        .delete(`apis/PartyOrder/${selectedPartyOrder}/`)
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
          } else {
            fetchOrders();
            setConfirmOrderOpenDialog(false);
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
    }
  }

  async function UpdatePartyOrder() {
    if (navigator.onLine) {
      let send_dict = {
        ...editFields,
        products: products,
      };
      console.log(send_dict);
      return await axiosInstance
        .put(`apis/PartyOrder/${selectedPartyOrder}/`, { ...send_dict })
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            let errors = data["message"];
            for (let err in errors) {
              toast.error(`${err} ${errors[err]}`);
            }
            setLoading(false);
            setConfirmProductAdd(false);
          } else {
            fetchOrders();
            setEditDialog(false);
            setProducts([]);
            setConfirmProductAdd(false);
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
          setLoading(false);
          setConfirmProductAdd(false);
        });
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
            setSalesOfficer(d);
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
    }
  }

  async function ConfirmChange() {
    setLoading(true);
    return await axiosInstance
      .get(`apis/ChangePartyOrderStatus/${selectedObjId}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          alert(`Error Occures ${data["message"]}`);
          setLoading(false);
        } else {
          fetchOrders();
          setLoading(false);
          setOpenDialog(false);
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
        setOpenDialog(false);
        setLoading(false);
        setOpenDialog(false);
      });
  }

  function ChangeStatus(e) {
    let id = e.currentTarget.getAttribute("id");
    setSelectedObjId(id);
    setOpenDialog(true);
  }

  function GenrateDispatch(e, row) {
    let id = e.currentTarget.getAttribute("id");
    setSelectedPartyOrder(row.row);
    setSelectedObjId(id);
    fetchReliventPartyOrders(id, true);
    setFields({
      ...fields,
      party_order: id,
      freight: row.row.freight,
    });
    setOpenDialog2(true);
  }

  const FiledChange = (event) => {
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
    }
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };

  function Calculate() {
    var count = 0;
    for (let row in products) {
      count += products[row].qty * products[row].rate;
    }
    var grand_total = count;
    grand_total = grand_total - editFields.freight;
    setEditFields({
      ...editFields,
      discounted_amount: 0,
      gross_total: count,
      total_amount: grand_total,
    });
  }

  const handleProductFieldChange = (e) => {
    setProductsFields({
      ...productsFields,
      [e.target.name]: e.target.value,
    });
  };

  const productValueChange = (_, value) => {
    if (value !== null) {
      setSelectedProduct(value);
      setProductsFields({
        ...productsFields,
        product: value.id,
      });
    }
  };

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

  const ProductfieldChange = (e) => {
    setProductsFields({
      ...productsFields,
      rate: selectedProduct.sales_price,
    });
  };

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
            setProdcutsFetched(pdts);
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
    }
  }

  async function DispatchConfirmed() {
    setLoading(true);
    if (!isUpdate) {
      await axiosInstance
        .post("apis/DispatchPartyOrder/", {
          ...dispatchFields,
          party_order: selectedPartyOrder.id,
        })
        .then((res) => {
          if (res.data["error"] === true) {
            let errors = res.data["message"];
            for (let err in errors) {
              toast.error(`${err} - ${errors[err]}`);
            }
            setLoading(false);
          } else {
            let data = res.data;
            toast.success(data["message"]);
            fetchOrders();
            setDispatchFields(initialDispatchFields);
            setOpenDialog2(false);
            setOpenDialog3(false);
            setLoading(false);
          }
        })
        .catch((error) => {
          toast.error(`${error}`);
          setLoading(false);
        });
    }
    else{
      await axiosInstance
      .put(`apis/DispatchPartyOrder/${selectedObjId}/`,{...dispatchFields,party_order:selectedObjId})
      .then((res) => {
        if (res.data["error"] === true) {
          let errors = res.data["message"];
          for (let err in errors) {
            toast.error(`${err} - ${errors[err]}`);
          }
          setLoading(false);
        } else {
          let data = res.data;
          toast.success(data["message"]);
          fetchOrders();
          setisUpdate(false);
          setOpenDialog2(false);
          setOpenDialog3(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(`${error}`);
        setLoading(false);
      });
    }
  }

  async function fetchOrders() {
    await axiosInstance
      .get("apis/PartyOrder/")
      .then((res) => {
        if (res["error"] === true) {
          toast.error(`Error Occures ${res["message"]}`);
        } else {
          var d = res["data"]["data"];
          for (let order in d) {
            d[order].party = d[order].party.name;
            d[order].sale_officer = d[order].sale_officer.name;
          }
          setRows(d);
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  async function GetReleventDispatch(id) {
    await axiosInstance
      .get(`apis/DispatchPartyOrder/${id}`)
      .then((res) => {
        if (res["error"] === true) {
          toast.error(`Error Occures ${res["message"]}`);
        } else {
          var d = res["data"]["data"];
          console.log(d);
          setDispatchFields({
            vehical: d.vehical.id,
            vehical_running:d.vehical_running,
            freight: d.freight,
            delivery_date: d.delivery_date,
            //  Debit
            freight_dr_type: d.freight_dr_type,
            freight_dr_header: d.freight_dr_header.id,
            freight_dr: d.freight_dr,
            // Credit
            freight_cr_type: d.freight_cr_type,
            freight_cr_header: d.freight_cr_header.id,
            freight_cr: d.freight_cr,
          });
          setFDHeaderTitle(d.freight_dr_header.name);
          setFCHeaderTitle(d.freight_cr_header.name);
          if (d.freight_dr_type === "Sales" || d.freight_dr_type === "Cash") {
            setFDDisabledHeader(true);
          } else {
            setFDDisabledHeader(false);
          }
          if (d.freight_cr_type === "Sales" || d.freight_cr_type === "Cash") {
            setFCDisabledHeader(true);
          } else {
            setFCDisabledHeader(false);
          }
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  const handleDateChange = (date) => {
    var d =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    setDispatchFields({
      ...dispatchFields,
      delivery_date: String(d),
    });
  };
  const ViewDispatchFields = (id) => {
    setisUpdate(true);
    GetReleventDispatch(id);
    setSelectedObjId(id);
    setOpenDialog2(true);
  };
  const openEditBox = (id) => {
    fetchParoducts();
    setProductsFields({
      ...productsFields,
      party_order: id,
    });
    setEditDialog(true);
    setSelectedPartyOrder(id);
    fetchReliventPartyOrders(id);
  };
  const EditPartyOrder = () => {
    setLoading(true);
    Calculate();
    UpdatePartyOrder();
  };
  const DeletePartyOrders = (id) => {
    setSelectedPartyOrder(id);
    setConfirmOrderOpenDialog(true);
  };
  const EditProduct = (e) => {
    let pdt = JSON.parse(e.target.id);
    if (e.target.name === "qty") {
      pdt.qty = e.target.value;
    }
    if (e.target.name === "rate") {
      pdt.rate = e.target.value;
    }
    let pdts = products.filter((p) => p.id !== pdt.id);
    setProducts([...pdts, pdt]);
  };
  const DeleteProduct = (id) => {
    let pdts = products.filter((p) => p.id !== id);
    if (pdts.length !== 0) {
      setProducts(pdts);
    }
  };
  const AddProduct = async () => {
    productsFields.product = { name: selectedProduct.name };
    setProducts([...products, productsFields]);
    setSelectedProduct([]);
    setProductsFields(initialProductFields);
    setConfirmProductAdd(false);
  };
  const OpenInvoice = (row) => {
    setSelectedPartyOrder(row);
    setInvoiceGenrate(true);
    setInvoiceDialogBox(true);
  };
  const handleGenratePDF = () => {
    const input = document.getElementById("PDFinvoice");
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save("download.pdf");
    });
  };
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "sale_officer",
      headerName: "Sales Officer",
      width: 200,
      editable: false,
    },
    {
      field: "party",
      headerName: "Party",
      width: 200,
      editable: false,
    },
    {
      field: "description",
      headerName: "Description",
      width: 190,
      editable: false,
    },
    {
      field: "gross_total",
      headerName: "Gross Total",
      type: "number",
      width: 150,
      editable: false,
    },
    {
      field: "discounted_amount",
      headerName: "Discount",
      type: "number",
      width: 170,
      editable: false,
    },
    {
      field: "freight",
      headerName: "Freight",
      type: "number",
      width: 150,
      editable: false,
    },
    {
      field: "pdt_qty__sum",
      headerName: "Products Total",
      type: "number",
      width: 170,
      editable: false,
    },
    {
      field: "pandding_amount",
      headerName: "Net Amount Receivable ",
      type: "number",
      width: 225,
      editable: false,
    },
    {
      field: "Amount Received ",
      headerName: "Amount Received ",
      type: "number",
      width: 225,
      editable: false,
      renderCell: (row) => {
        return row.row.total_amount - row.row.pandding_amount;
      },
    },
    {
      field: "total_amount",
      headerName: "Total Amount",
      type: "number",
      width: 170,
      editable: false,
    },
    {
      field: "dispatch",
      headerName: "View Dispatched",
      width: 190,
      editable: false,
      renderCell: (row) => {
        if (
          row.row.status === "Delivered" &&
          props.group !== GroupStatus.SALESOFFICER
        ) {
          return (
            <IconButton onClick={() => ViewDispatchFields(row.row.id)}>
              <VisibilityOutlinedIcon color="primary" />
            </IconButton>
          );
        } else {
          return (
            <IconButton disabled>
              <VisibilityOutlinedIcon />
            </IconButton>
          );
        }
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      editable: false,
      renderCell: (row) => {
        if (row.row.status === "Pending") {
          return <span style={{ color: "red" }}>{row.row.status}</span>;
        } else if (row.row.status === "Delivered") {
          return (
            <span style={{ color: "green" }}>
              <b>{row.row.status}</b>
            </span>
          );
        } else {
          return <span style={{ color: "green" }}>{row.row.status}</span>;
        }
      },
    },
    {
      field: "PDF",
      headerName: "PDF",
      width: 120,
      editable: false,
      renderCell: (row) => (
        <IconButton
          color="secondary"
          onClick={() => {
            OpenInvoice(row.row);
          }}
        >
          <PictureAsPdfOutlinedIcon />
        </IconButton>
      ),
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      headerAlign: "center",
      editable: false,
      renderCell: (row) => {
        if (row.row.status === "Pending") {
          return (
            <>
              {props.group === GroupStatus.SALESOFFICER ? undefined : (
                <Button
                  aria-label="delete"
                  color="secondary"
                  onClick={ChangeStatus}
                  size="small"
                  id={row.row.id}
                >
                  <AddAlarmOutlinedIcon />
                </Button>
              )}
              {props.group === GroupStatus.DISPATCHER ? undefined : (
                <IconButton
                  onClick={() => {
                    DeletePartyOrders(row.row.id);
                  }}
                >
                  <DeleteIcon color="primary" />
                </IconButton>
              )}
              <IconButton
                onClick={() => {
                  openEditBox(row.row.id);
                }}
              >
                <EditIcon color="primary" />
              </IconButton>
            </>
          );
        }
        if (row.row.status === "Delivered") {
          return (
            <>
              {props.group === GroupStatus.SALESOFFICER ? undefined : (
                <Button
                  aria-label="delete"
                  color="primary"
                  size="small"
                  id={row.row.id}
                >
                  <LocalShippingIcon />
                </Button>
              )}
              {props.group === GroupStatus.SALESOFFICER ||
              props.group === GroupStatus.DISPATCHER ? undefined : (
                <IconButton
                  onClick={() => {
                    DeletePartyOrders(row.row.id);
                  }}
                >
                  <DeleteIcon color="primary" />
                </IconButton>
              )}
              {props.group === GroupStatus.DISPATCHER ||
              props.group === GroupStatus.SALESOFFICER ? undefined : (
                <IconButton
                  onClick={() => {
                    openEditBox(row.row.id);
                  }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              )}
            </>
          );
        } else {
          return (
            <>
              {props.group === GroupStatus.SALESOFFICER ? undefined : (
                <Button
                  aria-label="delete"
                  color="default"
                  onClick={(e) => GenrateDispatch(e, row)}
                  size="small"
                  id={row.id}
                >
                  <DoneAllIcon />
                </Button>
              )}
              {props.group === GroupStatus.SALESOFFICER ? undefined : (
                <IconButton
                  onClick={() => {
                    DeletePartyOrders(row.row.id);
                  }}
                >
                  <DeleteIcon color="primary" />
                </IconButton>
              )}
              {props.group === GroupStatus.DISPATCHER ||
              props.group === GroupStatus.SALESOFFICER ? undefined : (
                <IconButton
                  onClick={() => {
                    openEditBox(row.row.id);
                  }}
                >
                  <EditIcon color="primary" />
                </IconButton>
              )}
            </>
          );
        }
      },
    },
  ];

  useEffect(() => {
    if (props.group === GroupStatus.SALESOFFICER) {
      setSalesOfficerDisabled(true);
    }
    fetchOrders();
  }, [props.group]);

  useEffect(() => {
    Calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, editFields.freight]);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        className={`${classes.formRoot} ${classes.gultter}`}
      >
        {/* TITLE */}
        <Grid item>
          <Typography variant="h3" color="primary">
            Party Orders
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={fetchOrders}>
            <CachedIcon></CachedIcon>
          </Button>
        </Grid>
      </Grid>
      <DataGrid
        rows={rows}
        columns={columns}
        autoPageSize
        className={classes.table}
        autoHeight
        disableSelectionOnClick
        loading={loading}
      />
      {/* Confirm */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(!openDialog)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Order Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to confirm the order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(!openDialog)} color="default">
            No
          </Button>
          <Button onClick={ConfirmChange} color="secondary" autoFocus>
            {loading === true ? (
              <CircularProgress color="secondary" />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dispatch  */}
      <Dialog open={openDialog2} onClose={() => setOpenDialog(!openDialog2)}>
        <DialogTitle>{"Dispatch Details"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Dispatch with</DialogContentText>
          <Grid container spacing={3}>
            <Grid item xs={6} md={4}>
              <Selecter
                fw={true}
                title={vehicalTitle}
                handleChange={HandleDispatchFields}
                value={dispatchFields.vehical}
                onOpen={fetchVehicals}
                choises={vehicals}
                name="vehical"
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
                type="string"
                value={dispatchFields.vehical_running}
                onChange={HandleDispatchFields}
              />
            </Grid>
            <Grid item xs={12}>
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
              setFields(initialDispatchFields);
              setOpenDialog2(false);
            }}
            color="default"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setOpenDialog3(true)}
            color="primary"
            autoFocus
          >
            {loading ? <CircularProgress color="secondary" /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dispatch Confirmation */}
      <Dialog open={openDialog3} onClose={() => setOpenDialog(false)}>
        <DialogTitle id="alert-dialog-title">{"Order Dispatch"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Dispatch the order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog3(false)} color="default">
            No
          </Button>
          <Button onClick={DispatchConfirmed} color="secondary" autoFocus>
            {loading === true ? (
              <CircularProgress color="secondary" />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Party Order */}
      <Dialog open={openEditDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>{"Order Update"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs>
              <Selecter
                title={partyTitle}
                disabled={partyDisabled}
                handleChange={FiledChange}
                value={editFields.party}
                onOpen={() => fetchParties()}
                choises={parties}
                name="party"
              />
            </Grid>
            <Grid item xs>
              <Selecter
                title={salesOfficerTitle}
                disabled={salesOfficerDisabled}
                handleChange={FiledChange}
                value={fields.sale_officer}
                onOpen={fetchSalesOfficers}
                choises={salesOfficer}
                name="sale_officer"
              />
            </Grid>
            <Grid item>
              <InputField
                size="small"
                label="freight"
                type="string"
                onChange={FieldsCahange}
                name="freight"
                value={editFields.freight}
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                size="medium"
                fullWidth
                label="Description *"
                type="string"
                onChange={FieldsCahange}
                name="description"
                value={editFields.description}
              />
            </Grid>
            {/* Products */}
            <form
              action=""
              style={{ display: "block" }}
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmProductAdd(true);
              }}
            >
              <Grid item container spacing={3} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="body1" color="primary">
                    {" "}
                    Add Products
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <AutoSuggestField
                    options={prodcutsFetched}
                    selectedOption={(option) => option.name || ""}
                    label={"Select Product"}
                    id={"ProductName"}
                    size={180}
                    value={selectedProduct}
                    valueChange={productValueChange}
                    name="product"
                    required={true}
                    onChange={ProductfieldChange}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <InputField
                    size="small"
                    label="qty"
                    type="number"
                    onChange={handleProductFieldChange}
                    name="qty"
                    value={productsFields.qty}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <InputField
                    size="small"
                    label="Rate"
                    type="number"
                    onChange={handleProductFieldChange}
                    name="rate"
                    value={productsFields.rate}
                  />
                </Grid>
                <Grid item xs={4} md={2}>
                  <IconButton type="submit">
                    <AddCircleIcon color="primary" style={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
              </Grid>
            </form>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" colSpan={2}>
                        Name
                      </TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Rate</TableCell>
                      <TableCell align="center">Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((pdt) => (
                      <TableRow key={pdt.id}>
                        <TableCell colSpan={2} align="center">
                          <Typography variant="overline">
                            {pdt.product.name}
                          </Typography>
                        </TableCell>
                        <TableCell className={classes.xsInput} align="center">
                          <InputField
                            size="small"
                            label="qty"
                            type="number"
                            id={JSON.stringify(pdt)}
                            onChange={EditProduct}
                            name="qty"
                            fullWidth
                            value={pdt.qty}
                          />
                        </TableCell>
                        <TableCell className={classes.xsInput} align="center">
                          <InputField
                            size="small"
                            label="rate"
                            type="number"
                            id={JSON.stringify(pdt)}
                            onChange={EditProduct}
                            name="rate"
                            fullWidth
                            value={pdt.rate}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            onClick={() => {
                              DeleteProduct(pdt.id);
                            }}
                          >
                            <DeleteIcon color="primary" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} color="default">
            No
          </Button>
          <Button
            onClick={() => {
              EditPartyOrder();
            }}
            color="secondary"
          >
            {loading === true ? (
              <CircularProgress color="secondary" />
            ) : (
              "Update"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Product Add Confirm */}
      <Dialog
        open={confirmProductAdd}
        onClose={() => setConfirmProductAdd(false)}
      >
        <DialogTitle id="alert-dialog-title">{"Add Product ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to ADD The Product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmProductAdd(false)} color="default">
            Cancel
          </Button>
          <Button onClick={AddProduct} color="secondary" autoFocus>
            {loading === true ? (
              <CircularProgress color="secondary" />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dispatch Confirmation */}
      <Dialog
        open={confirmOrderOpenDialog}
        onClose={() => setConfirmOrderOpenDialog(false)}
      >
        <DialogTitle id="alerts">{"Are You Sure"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmOrderOpenDialog(false)}
            color="default"
          >
            No
          </Button>
          <Button onClick={ConfirmOrderDelete} color="secondary" autoFocus>
            {loading === true ? (
              <CircularProgress color="secondary" />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* PDF */}
      <Dialog
        open={invoiceDialogBox}
        onClose={() => {
          setInvoiceGenrate(false);
          setInvoiceDialogBox(false);
        }}
        className={classes.pdf}
      >
        <DialogTitle id="Dialog">Invoice View</DialogTitle>
        <DialogContent>
          {!invoiceGenrate ? undefined : (
            <div className="invoice-box" id="PDFinvoice">
              <table>
                <tr className="top" key="top">
                  <td colSpan={4}>
                    <table>
                      <tr key="InvoiceImage">
                        <td className="title">
                          <img
                            src={logo}
                            alt="Company logo"
                            style={{ width: "100%", maxWidth: "250px" }}
                          />
                        </td>

                        <td>
                          Invoice #: {selectedPartyOrder.id}
                          <br />
                          Created: {selectedPartyOrder.date}
                          <br />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr className="information" key="information">
                  <td colSpan={4}>
                    <table>
                      <tr key="table">
                        <td>
                          Sales Officer
                          <br />
                          Dispatch Party
                        </td>

                        <td>
                          {selectedPartyOrder.sale_officer}
                          <br />
                          {selectedPartyOrder.party}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr className="heading" key="heading">
                  <td>Product</td>
                  <td>Qty</td>
                  <td>Rate</td>
                  <td>Total</td>
                </tr>
                {!selectedPartyOrder
                  ? undefined
                  : selectedPartyOrder.products.map((pdt, index, arr) => {
                      return (
                        <>
                          {index === arr.length - 1 ? (
                            <tr className="item last" key={pdt.product.name}>
                              <td>{pdt.product.name}</td>
                              <td>{pdt.qty}</td>
                              <td>{pdt.rate}</td>
                              <td>{pdt.rate * pdt.qty}</td>
                            </tr>
                          ) : (
                            <tr className="item" key={pdt.product.name}>
                              <td>{pdt.product.name}</td>
                              <td>{pdt.qty}</td>
                              <td>{pdt.rate}</td>
                              <td>{pdt.rate * pdt.qty}</td>
                            </tr>
                          )}
                        </>
                      );
                    })}

                <tr className="total" key="Grossstotal">
                  <td></td>

                  <td colSpan={4}>
                    Bags Total: {selectedPartyOrder.pdt_qty__sum}
                  </td>
                </tr>
                <tr className="total" key="Grossstotal">
                  <td></td>

                  <td colSpan={4}>
                    Grosss Total: {selectedPartyOrder.gross_total}
                  </td>
                </tr>

                <tr className="total" key="Grandtotal">
                  <td></td>

                  <td colSpan={4}>
                    Grand Total: {selectedPartyOrder.total_amount}
                  </td>
                </tr>
              </table>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="default"
            onClick={() => {
              setInvoiceGenrate(false);
              setInvoiceDialogBox(false);
            }}
          >
            Cancel
          </Button>
          <Button color="secondary" onClick={handleGenratePDF} autoFocus>
            Genrate PDF
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    group: state.group,
  };
};

export default connect(mapStateToProps, null)(DataTable);
