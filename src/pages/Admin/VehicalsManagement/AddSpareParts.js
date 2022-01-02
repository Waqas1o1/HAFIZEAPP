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
import MenuItems from "../../../components/MenuItems";
import Selecter from "../../../components/Selecter";

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
  choiseField:{
      
  }
}));

const AddSpareParts = () => {
  const initialFields = {
    name: "",
    condition: "",
    price: 0,
    product:"",
  };
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState(initialFields);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedObj, setSelectedObj] = useState([]);
  const [products, setProducts] = useState([]);
  const [productTitle, setProductTitle] = useState('Product');

  async function fetchSparePart() {
    return await axiosInstance
      .get("apis/SparePart/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let SpareParts = data["data"];
          console.log(SpareParts);
          setRows(SpareParts);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }
  async function fetchProducts() {
    return await axiosInstance
      .get("apis/VehicalProducts/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let products = data["data"];
          setProducts(products);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  function Reset() {
    setFields(initialFields);
    setLoading(false);
    fetchSparePart();
    setIsUpdate(false);
    setProductTitle('Product');
  }

  async function saveSaprePart() {
    if (!isUpdate) {
      return await axiosInstance
        .post("apis/SparePart/", { ...fields })
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
        .put(`apis/SparePart/${selectedObj.id}/`, { ...fields })
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
      .delete(`apis/SparePart/${selectedObj.id}/`)
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

  async function GetSaprePartForUpdate(id = selectedObj.id) {
    return await axiosInstance
      .get(`apis/SparePart/${id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let setData = {
            product: data.data.product.id,
            name: data.data.name,
            price: data.data.price,
            condition: data.data.condition,
          };
          setProductTitle(data.data.product.name);
          setFields(setData);
          setIsUpdate(true);
        }
      })
      .catch((error) => {
        toast.error(`Something wrong: ${error}`);
        setLoading(false);
      });
  }
  const handleButtonClick = () => {
    if (!loading) {
      setLoading(true);
      saveSaprePart();
    }
  };

  const FiledChange = (event) => {
    if (event.target.name === "product") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setProductTitle(obj.name);
    }
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };
  const UpdateSparePart = (obj) => {
    setSelectedObj(obj);
    GetSaprePartForUpdate(obj.id);
  };
  const columns = [
    { field: "id", headerName: "Sr#" },
    { field: "product", headerName: "Product", width: 160,renderCell:(row)=>row.row.name},
    { field: "name", headerName: "Perticuler", width: 150 },
    { field: "price", headerName: "Cost", width: 150 },
    { field: "condition", headerName: "Condition", width: 150 },
    {
      field: "acion",
      headerName: "Action",
      width: 250,
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

  useEffect(() => {
    fetchSparePart();
  }, []);

  return (
    <Grid container spacing={3} className={classes.formRoot}>
      {/* Title */}
      <Grid item xs={10} lg={11}>
        <Typography variant="h4" gutterBottom color="primary">
          Add Vehical Spare Parts
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
        <Grid item xs={12}>
          <Selecter
            title={productTitle}
            handleChange={FiledChange}
            value={fields.product}
            onOpen={fetchProducts}
            choises={products}
            name="product"
            fw={true}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            label="Perticular"
            type="string"
            size="small"
            name="name"
            fullWidth
            required={true}
            value={fields.name}
            onChange={FiledChange}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            label="Cost"
            type="number"
            size="small"
            name="price"
            fullWidth
            required={true}
            value={fields.price}
            onChange={FiledChange}
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </Grid>
        <Grid item xs={6}>
          <div className={classes.choiseField}>
            <MenuItems
              options={["New", "Used"]}
              title="Condition"
              handleChange={(e) => {
                setFields({
                  ...fields,
                  condition: e.target.value,
                });
              }}
              selectedOption={fields.condition}
            />
          </div>
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

export default AddSpareParts;
