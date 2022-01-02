import { Button, Checkbox, Grid, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DateFnsUtils from "@date-io/date-fns";
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
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

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
      backgroundColor: "#f1f1f1",
    },
  },
  choiseField: {},
}));

const DispacthPart = () => {
  let date = new Date();
  const initialFields = {
    vehical: "",
    spare_part: "",
    labour_cost: 0,
    total_cost: 0,
    update:false,
    running:"",
    reparing_date:
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
  };
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState(initialFields);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedObj, setSelectedObj] = useState([]);
  //   Vehical
  const [vehicals, setVehicals] = useState([]);
  const [vehicalTitle, setVehicalTitle] = useState("Vehical");
  //   Sapre Part
  const [parts, setParts] = useState([]);
  const [partTitle, setPartTitle] = useState("SaprePart");

  async function fetchDiaptchParts() {
    return await axiosInstance
      .get("apis/DiaptchVehicalPart/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let SpareParts = data["data"];
          setRows(SpareParts);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  async function fetchSparePart() {
    return await axiosInstance
      .get("apis/SparePart/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let SpareParts = data["data"];
          setParts(SpareParts);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  function Reset() {
    setFields(initialFields);
    setLoading(false);
    fetchDiaptchParts();
    setIsUpdate(false);
  }

  async function saveDiaptchVehicalPart() {
    if (!isUpdate) {
      return await axiosInstance
        .post("apis/DiaptchVehicalPart/", { ...fields })
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            let errors = data["message"];
            for (let err in errors) {
              toast.error(`${err} - ${data["message"]}`);
            }
          } else {
            Reset();
            toast.info(`${data["message"]}`);
          }
        })
        .catch((error) => {
          toast.error(`Somethin wrong: ${error}`);
          Reset();
        });
    } else {
      return await axiosInstance
        .put(`apis/DiaptchVehicalPart/${selectedObj.id}/`, { ...fields })
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            let errors = data["message"];
            for (let err in errors) {
              toast.error(`${err} - ${data["message"]}`);
            }
          } else {
            toast.info(`${data["message"]}`);
            Reset();
          }
        })
        .catch((error) => {
          toast.error(`Somethin wrong: ${error}`);
          Reset();
        });
    }
  }

  async function ConfirmDelete() {
    return await axiosInstance
      .delete(`apis/DiaptchVehicalPart/${selectedObj.id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          Reset();
          toast.info(`${data["message"]}`);
          setOpenDialog(false);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
        setOpenDialog(false);
        Reset();
      });
  }

  async function GetDiaptchVehicalPartForUpdate(id = selectedObj.id) {
    return await axiosInstance
      .get(`apis/DiaptchVehicalPart/${id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let setData = {
            vehical: data.data.vehical.id,
            spare_part: data.data.spare_part.id,
            labour_cost: data.data.labour_cost,
            total_cost: data.data.total_cost,
          };
          setVehicalTitle(data.data.vehical.vehical_no);
          setPartTitle(data.data.spare_part.name);
          setFields(setData);
          setIsUpdate(true);
        }
      })
      .catch((error) => {
        toast.error(`Something wrong: ${error}`);
        setLoading(false);
      });
  }
  async function fetchVehicals() {
    return await axiosInstance
      .get("apis/Vehicals/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let V = data["data"];
          for (let vh in V) {
            V[vh].name = `${V[vh].driver_name} : ${V[vh].vehical_no}`;
          }
          setVehicals(V);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }
  const handleButtonClick = () => {
    if (!loading) {
      setLoading(true);
      saveDiaptchVehicalPart();
    }
  };

  const FiledChange = (event) => {
    if (event.target.name === "vehical") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setVehicalTitle(obj.name);
    }
    if (event.target.name === "spare_part") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setPartTitle(obj.name);
    }

    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };
  const UpdateSparePart = (obj) => {
    setSelectedObj(obj);
    GetDiaptchVehicalPartForUpdate(obj.id);
  };
  const columns = [
    { field: "id", headerName: "Sr#" },
    {
      field: "vehical",
      headerName: "Vehical",
      width: 130,
      renderCell: (value) => value.value.vehical_no,
    },
    {
      field: "spare_part",
      headerName: "Spare Part",
      width: 150,
      renderCell: (value) => value.value.name,
    },
    { field: "labour_cost", headerName: "Labour Cost", width: 190 },
    { field: "total_cost", headerName: "Total Cost", width: 150 },
    {
      field: "acion",
      headerName: "Action",
      width: 150,
      headerAlign: "center",
      editable: false,
      renderCell: (row) => (
        <Grid container>
          <Grid item>
            <IconButton
              onClick={() => {
                UpdateSparePart(row);
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
  const handleDateChange = (date) => {
    var d =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    setFields({
      ...fields,
      reparing_date: String(d),
    });
  };
  const handleUpdateCheckBox =(e)=>{
    setFields({...fields,update:e.target.checked});
  }
  useEffect(() => {
    fetchDiaptchParts();
  }, []);

  return (
    <Grid container spacing={3} className={classes.formRoot}>
      {/* Title */}
      <Grid item xs={10} lg={11}>
        <Typography variant="h4" gutterBottom color="primary">
          Dispatch Vehical Spare Parts
        </Typography>
      </Grid>
      {/* Left */}
      <Grid item xs={2} lg={1}>
        <Button onClick={fetchSparePart}>
          <CachedIcon></CachedIcon>
        </Button>
      </Grid>

      {/* left */}
      <Grid item container spacing={3} xs={12} md={3}>
        <Grid item xs={6}>
          <Selecter
            title={vehicalTitle}
            handleChange={FiledChange}
            value={fields.vehical}
            onOpen={fetchVehicals}
            choises={vehicals}
            name="vehical"
            fw={true}
          />
        </Grid>
        <Grid item xs={6}>
          <Selecter
            title={partTitle}
            handleChange={FiledChange}
            value={fields.spare_part}
            onOpen={fetchSparePart}
            choises={parts}
            name="spare_part"
            fw={true}
          />
        </Grid>

        <Grid item>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              format="yyyy-MM-dd"
              id="reparing_date"
              name="ToDate"
              value={fields.reparing_date}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "Select ToDate",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={12}>
          <InputField
            label="Labour Cost"
            type="number"
            size="small"
            name="labour_cost"
            fullWidth
            required={true}
            value={fields.labour_cost}
            onChange={FiledChange}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>

        <Grid item xs={12}>
          <InputField
            label="Toal Cost"
            type="number"
            size="small"
            name="total_cost"
            fullWidth
            required={true}
            value={fields.total_cost}
            onChange={FiledChange}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={2}>
          <Checkbox  onChange={handleUpdateCheckBox} />
        </Grid>
        <Grid item xs={10}>
          <InputField
              label="New Running"
              type="number"
              size="small"
              name="running"
              fullWidth
              required={true}
              disabled={fields.update===true?false:true}
              value={fields.running}
              onChange={FiledChange}
              inputProps={{ style: { textTransform: "uppercase" } }}
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

export default DispacthPart;
