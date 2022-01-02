import { Button, Grid, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../apisConfig";
import InputField from "../../../components/InputField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import CachedIcon from "@material-ui/icons/Cached";
import DeleteIcon from "@material-ui/icons/Delete";
import { DataGrid } from "@material-ui/data-grid";
import SpineerButton from "../../../components/SpineerButton";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { toast } from "react-toastify";
import Selecter from "../../../components/Selecter";
import MenuItems from "../../../components/MenuItems";

const useStyles = makeStyles((theme) => ({
  formRoot: {
    marginRight: theme.spacing(-8),
  },
  table: {
    width: "100vh",
    "@media only screen and (max-width: 600px)": {
      width: "100%",
    },
  },
  dataGrid: {
    "& .MuiDataGrid-columnsContainer": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const AdvancePayment = () => {
  const initialFields = {
    employee: "",
    amount: "",
    description: "",
    payment_method: "",
    bank: "",
  };
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState(initialFields);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedObj, setSelectedObj] = useState([]);
  // Bank
  const [banks, setBanks] = useState([]);
  const [bankTitle, setBankTitle] = useState("Bank?");
  const [bankDisabled, setBankDisabled] = useState(true);
  //Employee
  const [employes, setEmployee] = useState([]);
  const [employeeTitle, setEmployeeTitle] = useState("Employee?");

  const handleMenuChange = (event) => {
    setFields({ ...fields, payment_method: event.target.value });
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

  async function fetchAdvance() {
    return await axiosInstance
      .get("apis/Addvance/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let queries = data["data"];
          setRows(queries);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }
  async function fetchBanks() {
    return await axiosInstance
      .get("apis/Bank/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let queries = data["data"];
          setBanks(queries);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }
  async function fetchEmployees() {
    return await axiosInstance
      .get("apis/Employee/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let queries = data["data"];
          setEmployee(queries);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  function Reset() {
    setFields(initialFields);
    setLoading(false);
    fetchAdvance();
    setIsUpdate(false);
  }

  async function saveAdvancePyement() {
    if (!isUpdate) {
      return await axiosInstance
        .post("apis/Advance/", { ...fields })
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
    } else {
      return await axiosInstance
        .put(`apis/Advance/${selectedObj.id}/`, { ...fields })
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
      .delete(`apis/Advance/${selectedObj.id}/`)
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

  async function GetAdvanceFroUpdate(id = selectedObj.id) {
    return await axiosInstance
      .get(`apis/Advance/${id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let setData = {
            employee: data.data.employee.id,
            amount: data.data.amount,
            transaction_type: data.data.transaction,
            bank: data.data.bank,
          };
          setEmployeeTitle(data.data.employee);
          if (data.data.transaction === "Bank") {
            setBankTitle(data.data.bank.name);
          }
          setFields(setData);
          setIsUpdate(true);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
        setLoading(false);
      });
  }

  const handleButtonClick = () => {
    if (!loading) {
      setLoading(true);
      saveAdvancePyement();
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
    if (event.target.name === "employee") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setEmployeeTitle(obj.name);
    }
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };
  const UpdateAdvancePayment = (obj) => {
    setSelectedObj(obj);
    GetAdvanceFroUpdate(obj.id);
  };
  const columns = [
    { field: "id", headerName: "Sr#" },
    { field: "employee", headerName: "Employee", flex: 1 },
    { field: "amount", headerName: "Advance", flex: 1 },
    { field: "payment_type", headerName: "TransactionType", flex: 1 },
    { field: "bank", headerName: "Bank", flex: 1 },
    {
      field: "acion",
      headerName: "Action",
      width: 200,
      headerAlign: "center",
      editable: false,
      renderCell: (row) => (
        <Grid container>
          <Grid item>
            <IconButton
              onClick={() => {
                UpdateAdvancePayment(row);
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
  const handleClose = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    fetchAdvance();
  }, []);

  return (
    <Grid container spacing={2} className={classes.formRoot}>
      {/* Title */}
      <Grid item xs={10} lg={11}>
        <Typography variant="h4" gutterBottom color="primary">
          Advance Pay
        </Typography>
      </Grid>
      {/* Left */}
      <Grid item xs={2} lg={1}>
        <Button onClick={fetchAdvance}>
          <CachedIcon></CachedIcon>
        </Button>
      </Grid>

      {/* left */}
      <Grid item container xs={12} md={3} spacing={3}>
        <Grid item xs={12}>
          <Selecter
            title={employeeTitle}
            handleChange={FiledChange}
            value={fields.employee}
            onOpen={fetchEmployees}
            choises={employes}
            fw={true}
            name="employee"
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            label="Description Note *"
            type="string"
            size="large"
            name="description"
            fullWidth
            required={true}
            value={fields.description}
            onChange={FiledChange}
          />
        </Grid>
        <Grid item xs={12}>
          <MenuItems
            options={["Cash", "Cheque", "Bank"]}
            title="Payment Method"
            disabled={isUpdate}
            handleChange={handleMenuChange}
            selectedOption={fields.payment_method}
          />
        </Grid>
        <Grid item xs={12}>
          <Selecter
            title={bankTitle}
            handleChange={FiledChange}
            value={fields.bank}
            onOpen={fetchBanks}
            choises={banks}
            disabled={bankDisabled}
            fw={true}
            name="bank"
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            label="Advance Amount"
            type="number"
            size="small"
            name="amount"
            fullWidth
            required={true}
            value={fields.amount}
            onChange={FiledChange}
          />
        </Grid>
        <Grid item xs={12}>
          <SpineerButton
            handleButtonClick={handleButtonClick}
            label={isUpdate ? "Update" : "Save"}
            loading={loading}
            success={false}
            fw={true}
            size="large"
            startIcon={isUpdate ? <EditIcon /> : <AddBoxOutlinedIcon />}
          />
        </Grid>
      </Grid>
      {/* Right */}
      <Grid item xs={12} md={9}>
        <DataGrid
          rows={rows}
          columns={columns}
          className={classes.dataGrid}
          autoPageSize
          autoHeight
          disableSelectionOnClick
          loading={loading}
        />
      </Grid>

      {/* // Model */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you Sure?"}</DialogTitle>
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
    </Grid>
  );
};

export default AdvancePayment;
