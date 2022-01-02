import { Button, Grid, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import CachedIcon from "@material-ui/icons/Cached";
import Selecter from "../../components/Selecter";
import axiosInstance from "../../apisConfig";
import InputField from "../../components/InputField";
import SpineerButton from "../../components/SpineerButton";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import MenuItems from "../../components/MenuItems";
import { DataGrid } from "@material-ui/data-grid";
import GroupStatus from "../../utils/status";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  formRoot: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  table: {
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: theme.palette.primary.dark,
      cursor: "pointer",
    },
  },
}));

const Recovery = (props) => {
  const initialFields = {
    party: "",
    party_order: "",
    sale_officer: "",
    payment_method: "Clearing",
    bank: "",
    amount: 0,
    description: "",
  };
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState(initialFields);
  const [isUpdate, setIsUpdate] = useState(false);
  // Party
  const [parties, setParties] = useState([]);
  const [partyTitle, setPartyTitle] = useState("Select Party");
  // Bank
  const [banks, setBanks] = useState([]);
  const [bankTitle, setBankTitle] = useState("Select Bank");
  // Sales Officer
  const [salesOfficer, setSalesOfficer] = useState([]);
  const [salesOfficerTitle, setSalesOfficerTitle] = useState("Sales Officer");
  const [salesOfficerDisabled, setSalesOfficerDisabled] = useState(false);
  // Party orders
  const [partyOrders, setPartyOrders] = useState([]);
  const [partyOrderTitle, setPartyOrdersTitle] = useState("Select Party Order");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedObjId, setSelectedObjId] = useState(0);
  const [bankDisabled, setBankDisabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState(fields.payment_method);

  const resetFields = () => {
    setFields(initialFields);
    setPartyTitle("Select Party");
    setSalesOfficerTitle("Select Sales Officer");
    setPartyOrdersTitle("Select PartyOrder");
    setBankTitle("Select Banks");
    setSelectedOption("Cash");
    setBankDisabled(true);
    fetchRecovery();
    checkIsAdmin();
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
              delete parties[p].date;
              delete parties[p].current_Balance;
            }
            setParties(parties);
            localStorage.removeItem("Parties");
            localStorage.setItem("Parties", JSON.stringify(parties));
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
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
            localStorage.removeItem("Bank");
            localStorage.setItem("Bank", JSON.stringify(bank));
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
    }
  }

  async function fetchRecovery() {
    if (navigator.onLine) {
      return await axiosInstance
        .get("apis/Recovery/")
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
          } else {
            let recovery = data["data"];
            for (let r in recovery) {
              recovery[r].party = recovery[r].party.name;
              recovery[r].sale_officer = recovery[r].sale_officer.name;
              recovery[r].party_order = recovery[r].party_order.id;
              recovery[r].bank = recovery[r].party.bank;
            }
            setRows(recovery);
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
    }
  }
  async function fetchPartyOrders() {
    if (navigator.onLine) {
      return await axiosInstance
        .get("apis/PartyOrder/")
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
          } else {
            let partyorder = data["data"];
            for (let order in partyorder) {
              if (partyorder[order].status === "Pendding") {
                delete partyorder[order];
              } else {
                partyorder[order].name = partyorder[order].id;
                delete partyorder[order].date;
                delete partyorder[order].party;
                delete partyorder[order].sale_officer;
              }
            }
            setPartyOrders(partyorder);
            localStorage.removeItem("PartyOrders");
            localStorage.setItem("PartyOrders", JSON.stringify(partyorder));
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
        });
    } else {
      setPartyOrders(JSON.parse(localStorage.getItem("PartyOrders")));
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
    } else {
      setSalesOfficer(JSON.parse(localStorage.getItem("SalesOfficer")));
    }
  }

  async function saveRecovery() {
    if (!isUpdate) {
      return await axiosInstance
        .post("apis/Recovery/", { ...fields })
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
            setSuccess(false);
            setLoading(false);
            resetFields();
          } else {
            setLoading(false);
            fetchRecovery();
            resetFields();
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
          setSuccess(false);
          setLoading(false);
          resetFields();
        });
    } else {
      return await axiosInstance
        .put(`apis/Recovery/${selectedObjId}/`, { ...fields })
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            alert(`Error Occures ${data["message"]}`);
            setSuccess(false);
            setLoading(false);
            resetFields();
          } else {
            fetchParties();
            setLoading(false);
            setIsUpdate(false);
            resetFields();
          }
        })
        .catch((error) => {
          alert(`Somethin wrong: ${error}`);
          setSuccess(false);
          setLoading(false);
          resetFields();
        });
    }
  }

  async function ConfirmDelete(e) {
    return await axiosInstance
      .delete(`apis/Recovery/${selectedObjId}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          alert(`Error Occures ${data["message"]}`);
        } else {
          fetchParties();
          setFields(initialFields);
          setOpenDialog(false);
          fetchRecovery();
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
        setOpenDialog(false);
      });
  }

  async function GetRecoveryForUpdate(id = selectedObjId) {
    return await axiosInstance
      .get(`apis/Recovery/${id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          alert(`Error Occures ${data["message"]}`);
          fetchRecovery();
        } else {
          var bank = "";
          if (data.data.payment_method === "Bank" || data.data.payment_method === "Cheque") 
          {
            bank = data.data.bank.id;
            setBankTitle(data.data.bank.name);
            setBankDisabled(false);
          }
         else {
            setBankTitle("Select Bank");
            setBankDisabled(true);
          }
          var party_order = "";
          if (data.data.party_order) {
            party_order = data.data.party_order.id;
          }
          let setData = {
            party: data.data.party.id,
            party_order: party_order,
            sale_officer: data.data.sale_officer.id,
            payment_method: data.data.payment_method,
            bank: bank,
            amount: data.data.amount,
            description: data.data.description,
          };
          console.log(data.data)
          setFields(setData);
          setSelectedOption(data.data.payment_method);
          setPartyOrdersTitle(setData.party_order);
          setPartyTitle(data.data.party.name);
          setSalesOfficerTitle(data.data.sale_officer.name);
          fetchRecovery();
          setIsUpdate(true);
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
        setSuccess(false);
        setLoading(false);
        fetchRecovery();
      });
  }

  const selecterOpen = (event) => {
    // fetchDiscounts();
  };

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      saveRecovery();
    }
  };

  const FiledChange = (event) => {
    if (event.target.name === "bank") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setBankTitle(obj.name);
    }
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
    if (event.target.name === "party_order") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setPartyOrdersTitle(obj.name);
    }
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };

  const onDelete = (event) => {
    let id = event.currentTarget.getAttribute("id");
    setSelectedObjId(id);
    setOpenDialog(true);
  };

  const onUpdate = (event) => {
    let id = event.currentTarget.getAttribute("id");
    setSelectedObjId(id);
    GetRecoveryForUpdate(id);
  };

  const onActive = async (event) => {
    let id = event.currentTarget.getAttribute("id");
    setSelectedObjId(id);
    await axiosInstance
      .get(`apis/AproveRecovery/${id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          alert(`Error Occures ${data["message"]}`);
        } else {
          fetchRecovery();
        }
      })
      .catch((error) => {
        alert(`Somethin wrong: ${error}`);
      });
    fetchRecovery();
  };
  function checkIsAdmin() {
    let u = localStorage.getItem("salesofficer");
    if (u === "undefined" || u !== null) {
      let so = JSON.parse(u);
      setSalesOfficerDisabled(true);
      setSalesOfficerTitle(so.name);
      setFields({
        ...fields,
        sale_officer: so.id,
      });
    }
  }

  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleMenuChange = (event) => {
    setSelectedOption(event.target.value);
    setFields({
      ...fields,
      payment_method: event.target.value,
    });
    if (event.target.value === "Bank" || event.target.value === "Cheque") {
      setBankDisabled(false);
    } else {
      setBankDisabled(true);
    }
  };

  useEffect(() => {
    fetchParties();
    fetchBank();
    fetchRecovery();
    fetchSalesOfficers();
    fetchPartyOrders();
    checkIsAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

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
      width: 250,
      editable: false,
    },
    {
      field: "party_order",
      headerName: "Party Order #",
      type: "number",
      width: 200,
      editable: false,
    },
    {
      field: "payment_method",
      headerName: "Payment Method",
      type: "string",
      width: 200,
      editable: false,
    },
    {
      field: "amount",
      headerName: "Amount Recived",
      type: "number",
      width: 200,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      editable: false,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      editable: false,
      renderCell: (row) => (
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={1}
        >
          {(props.group === GroupStatus.SUPERUSER) |
          (row.row.status === "Pending") ? (
            <Grid item xs={4}>
              <Button
                aria-label="delete"
                color="secondary"
                size="small"
                onClick={onDelete}
                id={row.id}
              >
                <DeleteIcon />
              </Button>
            </Grid>
          ) : undefined}

          <Grid item xs={4} onClick={onUpdate} id={row.id}>
            <IconButton aria-label="edit" size="small" key={row.id}>
              <CreateIcon />
            </IconButton>
          </Grid>
          <Grid item xs={4}>
            {props.group !== GroupStatus.SALESOFFICER &&
            row.row.status === "Pending" ? (
              <IconButton
                onClick={onActive}
                id={row.id}
                aria-label="active"
                color="primary"
                size="small"
                key={row.id}
              >
                <DoneAllIcon />
              </IconButton>
            ) : undefined}
          </Grid>
        </Grid>
      ),
    },
  ];
  return (
    <Grid container spacing={2} className={classes.formRoot}>
      {/* Title */}
      <Grid item xs={11}>
        <Typography variant="h4" gutterBottom color="primary">
          Recovery
        </Typography>
      </Grid>
      {/* Left */}
      <Grid item xs={1}>
        <Button onClick={fetchRecovery}>
          <CachedIcon></CachedIcon>
        </Button>
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
        <Grid container item direction="column" spacing={3}>
          <Grid item container spacing={3}>
            <Grid item xs>
              <Selecter
                title={partyTitle}
                handleChange={FiledChange}
                value={fields.party}
                disabled={isUpdate ? true : false}
                onOpen={selecterOpen}
                choises={parties}
                name="party"
              />
            </Grid>
            {/* Sales Ofiicer Select */}
            <Grid item xs>
              <Selecter
                title={salesOfficerTitle}
                disabled={salesOfficerDisabled || isUpdate ? true : false}
                handleChange={FiledChange}
                value={fields.sale_officer}
                onOpen={selecterOpen}
                choises={salesOfficer}
                name="sale_officer"
              />
            </Grid>

            {/* PartyOrder */}
            <Grid item xs>
              <Selecter
                title={partyOrderTitle}
                handleChange={FiledChange}
                value={fields.party_order}
                onOpen={selecterOpen}
                choises={partyOrders}
                name="party_order"
              />
            </Grid>
          </Grid>

         

          {/* Payment Method */}
          <Grid item xs>
            <MenuItems
              options={
                props.group === GroupStatus.SALESOFFICER
                  ? ["SalesOfficer", "Cheque", "Bank"]
                  : ["Cash", "Cheque", "Bank"]
              }
              title="Payment Method"
              disabled={isUpdate}
              handleChange={handleMenuChange}
              selectedOption={selectedOption}
            />
          </Grid>
           {/* Description */}
           <Grid item xs>
            <InputField
              size="small"
              label={fields.payment_method==='Cheque'?"Cheque No":"Description"}
              type="string"
              onChange={FiledChange}
              name="description"
              fullWidth
              value={fields.description}
            />
          </Grid>

          {/* Banks */}
          <Grid item xs>
            <Selecter
              title={bankTitle}
              handleChange={FiledChange}
              value={fields.bank}
              onOpen={selecterOpen}
              choises={banks}
              name="bank"
              disabled={bankDisabled}
            />
          </Grid>
          {/* Recived Amount */}
          <Grid item xs>
            <InputField
              size="small"
              label="Amount Recived"
              type="number"
              value={fields.amount}
              onChange={FiledChange}
              name="amount"
            />
          </Grid>

          {/* Save Button */}
          <Grid item container>
            <SpineerButton
              handleButtonClick={handleButtonClick}
              label={isUpdate ? "Update" : "Save"}
              loading={loading}
              success={success}
              size="large"
              startIcon={isUpdate ? <EditIcon /> : <AddBoxOutlinedIcon />}
            />
          </Grid>
        </Grid>
      </Grid>
      {/* Right */}
      <Grid item xs={12} md={9} lg={9}>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={7}
            className={classes.table}
            headerHeight={50}
            disableSelectionOnClick
            loading={loading}
          />
        </div>
      </Grid>

      {/* // Model */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are You Sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           Confirm Delete Recovery ({selectedObjId})
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
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    group: state.group,
  };
};

export default connect(mapStateToProps, null)(Recovery);
