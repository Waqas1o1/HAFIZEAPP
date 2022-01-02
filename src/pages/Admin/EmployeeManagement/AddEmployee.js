import { Button, Grid, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import Selecter from "../../../components/Selecter";
import axiosInstance from "../../../apisConfig";
import InputField from "../../../components/InputField";
import SpineerButton from "../../../components/SpineerButton";
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
import { toast } from "react-toastify";

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

const AddEmployee = () => {
  const initialFields = {
    name: "",
    email: "",
    creditLimit: "",
    contact: "",
    cnic: "",
    department: "",
    role: "",
    salary: "",
    opening_Balance: "",
  };
  const classes = useStyles();
  const [rows, setRows] = useState([]);

  const [fields, setFields] = useState(initialFields);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [Roles, setRoles] = useState([]);
  const [roleTitle, setRoleTitle] = useState("Role");
  const [Departments, setDepartments] = useState([]);
  const [DepartmentTitle, setDepartmentTitle] = useState("Department");
  const [selectedObj, setSelectedObj] = useState([]);

  async function fetchDepartments() {
    if (navigator.onLine) {
      return await axiosInstance
        .get("apis/Department/")
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            toast.error(`Error Occures ${data["message"]}`);
          } else {
            var d = data["data"];
            for (let p in d) {
              delete d[p].date;
              delete d[p].current_Balance;
            }
            setDepartments(d);
          }
        })
        .catch((error) => {
          toast.error(`Somethin wrong: ${error}`);
        });
    }
  }

  async function fetchEmployees() {
    return await axiosInstance
      .get("apis/Party/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let employees = data["data"];
          for (let p in employees) {
            delete employees[p].current_Balance;
            employees[p].sale_officer = employees[p].sale_officer.name;
            employees[p].area = employees[p].area.name;
          }
          setRows(employees);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  async function fetchRoles() {
    return await axiosInstance
      .get("apis/Roles/")
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          setRoles(data.data);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  function Reset() {
    DepartmentTitle("Department");
    setFields(initialFields);
    setLoading(false);
    fetchEmployees();
    setIsUpdate(false);
  }

  async function saveEmployee() {
    if (!isUpdate) {
      return await axiosInstance
        .post("apis/Employee/")
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            let errors = data["message"];
            for (let err in errors) {
              toast.info(`${err}->${errors[err]}`);
            }
            setLoading(false);
          } else {
            toast.success(data["message"]);
            Reset();
          }
        })
        .catch((error) => {
          toast.error(`Somethin wrong: ${error}`);
          Reset();
        });
    } else {
      return await axiosInstance
        .put(`apis/Employee/${selectedObj.id}/`)
        .then((res) => {
          let data = res.data;
          if (data["error"] === true) {
            let errors = data["message"];
            for (let err in errors) {
              toast.info(`${err}->${errors[err]}`);
            }
            setLoading(false);
          } else {
            toast.success(data["message"]);
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
      .delete(`apis/Employee/${selectedObj.id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          toast.info(`SuccessFuly Seleted ${selectedObj.id}`);
          Reset();
          setOpenDialog(false);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
        setOpenDialog(false);
        Reset();
      });
  }

  async function GetEmployeeForUpdate(id = selectedObj.id) {
    return await axiosInstance
      .get(`apis/Employee/${id}/`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
        } else {
          let setData = {
            name: data.data.name,
            email: data.data.email,
            contact: data.data.contact,
            cnic: data.data.cnic,
            salary: data.data.salary,

            department: data.data.department.id,
            role: data.data.role.id,
            opening_Balance: data.data.opening_Balance,
          };
          setFields(setData);
          setDepartmentTitle(data.data.department.name);
          setRoleTitle(data.data.role.name);
          setIsUpdate(true);
        }
      })
      .catch((error) => {
        toast.error(`Somethin wrong: ${error}`);
        setLoading(false);
      });
  }
  const handleButtonClick = (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      saveEmployee();
    }
  };

  const FiledChange = (event) => {
    if (event.target.name === "department") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setDepartmentTitle(obj.name);
    }
    if (event.target.name === "role") {
      const index = event.target.selectedIndex;
      const optionElement = event.target.childNodes[index];
      const optionElementId = optionElement.getAttribute("id");
      const obj = JSON.parse(optionElementId);
      setRoleTitle(obj.name);
    }

    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };
  const UpdateEmployee = (obj) => {
    setSelectedObj(obj);
    GetEmployeeForUpdate(obj.id);
  };
  const columns = [
    { field: "id", headerName: "Sr#" },
    // info
    { field: "name", headerName: "Name", width: 120 },
    { field: "contact", headerName: "Contact #", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "cnic", headerName: "CNIC", width: 110 },

    { field: "department", headerName: "Department", width: 200 },
    { field: "Role", headerName: "Role", width: 200 },
    { field: "creditLimit", headerName: "Credit Limit", width: 200 },
    { field: "opening_Balance", headerName: "Opening Balance", width: 200 },

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
                UpdateEmployee(row);
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
    fetchEmployees();
  }, []);

  return (
    <Grid container spacing={2} className={classes.formRoot}>
      {/* Title */}
      <Grid item xs={10} lg={11}>
        <Typography variant="h4" gutterBottom color="primary">
          Add Employee
        </Typography>
      </Grid>
      {/* Left */}
      <Grid item xs={2} lg={1}>
        <Button onClick={fetchEmployees}>
          <CachedIcon></CachedIcon>
        </Button>
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
        {/* left */}
        <form onSubmit={handleButtonClick} style={{ display: "contents" }}>
          <Grid container item spacing={3}>
            <Grid item xs={6}>
              <Selecter
                title={DepartmentTitle}
                handleChange={FiledChange}
                value={fields.department}
                onOpen={fetchDepartments}
                choises={Departments}
                fw={true}
                name="department"
              />
            </Grid>
            <Grid item xs={6}>
              <Selecter
                title={roleTitle}
                fw={true}
                handleChange={FiledChange}
                value={fields.role}
                onOpen={fetchRoles}
                choises={Roles}
                name="role"
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                label="Name"
                type="string"
                size="small"
                name="name"
                fullWidth
                required={true}
                value={fields.name}
                onChange={FiledChange}
              />
            </Grid>
            <Grid item container spacing={3}>
              <Grid item xs={6}>
                <InputField
                  label="Salary"
                  type="string"
                  size="small"
                  name="salary"
                  required={true}
                  value={fields.salary}
                  onChange={FiledChange}
                />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  label="Credit Limit"
                  type="number"
                  size="small"
                  name="creditLimit"
                  required={true}
                  value={fields.creditLimit}
                  onChange={FiledChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <InputField
                label="Email"
                type="email"
                size="small"
                name="email"
                required={true}
                value={fields.email}
                onChange={FiledChange}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                size="small"
                label="Contact"
                type="string"
                name="contact"
                fullWidth
                required={true}
                value={fields.contact}
                onChange={FiledChange}
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                size="small"
                label="CNIC"
                type="string"
                name="cnic"
                fullWidth
                required={true}
                value={fields.cnic}
                onChange={FiledChange}
              />
            </Grid>

            <Grid item xs={12}>
              <InputField
                size="small"
                label="Opening Balance"
                type="number"
                required={true}
                onChange={FiledChange}
                fullWidth
                name="opening_Balance"
                value={isUpdate ? 0 : fields.opening_Balance}
                disabled={isUpdate ? true : false}
              />
            </Grid>

            <Grid item xs={12}>
              <SpineerButton
                type="submit"
                label={isUpdate ? "Update" : "Save"}
                loading={loading}
                fw={true}
                size="large"
                startIcon={isUpdate ? <EditIcon /> : <AddBoxOutlinedIcon />}
              />
            </Grid>
          </Grid>
        </form>
      </Grid>
      {/* Right */}
      <Grid item xs={12} md={9} lg={9}>
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

export default AddEmployee;
