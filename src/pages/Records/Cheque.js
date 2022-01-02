import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../apisConfig";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import PregnantWomanIcon from "@material-ui/icons/PregnantWoman";
import CachedIcon from "@material-ui/icons/Cached";
import Selecter from "../../components/Selecter";

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#dae3e0",
      cursor: "pointer",
    },
  },
}));

export default function Cheque() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [confirmBox, setConfirmBox] = useState(false);
  const [headerBox, setHeaderBox] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("Select Header");
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState();
  const [fields, setfields] = useState({ id: "", type: "", header: "" });

  async function fetchRows() {
    await axiosInstance
      .get("apis/Cheque")
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => {
        toast.error(`${err}`);
      });
  }
  async function ChangeStatus() {
    await axiosInstance
      .get(`apis/ChequeStatusChange/${fields.id}/${fields.type}/${fields.header?fields.header:0}`)
      .then((res) => {
        fetchRows();
        setfields({ type: "", id: "", header: "" });
      })
      .catch((err) => {
        toast.error(`${err}`);
      });
    setHeaderBox(false);
    setHeaderTitle('Header');
    setLoading(false);
    setConfirmBox(false);
  }

  const ConfirmedChange = () => {
    setLoading(true);
    ChangeStatus();
  };
  async function FetchReciverReleventHeader(){
    let send_type = fields.type;
    if (send_type === 'BankDeposited'){
        send_type = 'Bank';
    }
    else if (send_type === 'SalesOfficerWithdrawn'){
      send_type = 'SalesOfficer';
    }
    return await axiosInstance.get(`apis/${send_type}/`)
    .then(res=>{
        let data  = res.data;
        if (data['error'] === true){
            alert(`Error Occures ${data['message']}`);
        }
        else{
            let headers = data['data'];
            for (let h in headers){
                delete headers[h].date;
                delete headers[h].current_Balance;
                
            }
            setHeaders(headers);
        }
    })
    .catch(error=>{
        alert(`Somethin wrong: ${error}`);
    })
} 
  useEffect(() => {
    fetchRows();
  }, []);

  const hanldeConfirmDialog = (id, type) => {
    setfields({ ...fields, id: id, type: type });
    setHeaderTitle('Header');
    if (type === 'BankDeposited' || type === 'SalesOfficerWithdrawn'){
      setHeaderBox(true);
    }else{
      setConfirmBox(true);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "party",
      headerName: "Party",
      width: 150,
      headerAlign: "center",
      renderCell: (row) => {
        return row.row.party.name;
      },
    },
    {
      field: "Supplier",
      headerName: "Supplier ",
      width: 130,
      headerAlign: "center",
      renderCell: (row) => {
        return row.row.supplier.name;
      },
    },
    {
      field: "bank",
      headerName: "Bank",
      type: "number",
      width: 140,
      headerAlign: "center",
      renderCell: (row) => {
        return row.row.bank.name;
      },
    },
    {
      field: "description",
      headerName: "Description",
      description: "Discription Attached",
      sortable: false,
      width: 140,
    },
    {
      field: "total_amount",
      headerName: "Amount",
      type: "number",
      headerAlign: "center",
      width: 140,
    },
    {
      field: "status",
      headerName: "Status",
      type: "number",
      headerAlign: "center",
      width:170,
    },
    {
      field: "action",
      headerName: "Action",
      type: "string",
      width: 200,
      headerAlign: "center",
      renderCell: (row) => (
        <Grid container>
          {row.row.status === "Pending" ? (
            <>
              <Grid item xs={3}>
                <IconButton
                  onClick={() => {
                    hanldeConfirmDialog(row.row.id, "Bounced");
                  }}
                >
                  <KeyboardReturnIcon size="small" />
                </IconButton>
              </Grid>
              <Grid item xs={3}>
                <IconButton
                  onClick={() => {
                    hanldeConfirmDialog(row.row.id, "BankDeposited");
                  }}
                >
                  <AccountBalanceIcon size="small" />
                </IconButton>
              </Grid>
              <Grid item xs={3}>
                <IconButton
                  onClick={() => {
                    hanldeConfirmDialog(row.row.id, "Withdrawn");
                  }}
                >
                  <AttachMoneyIcon size="small" />
                </IconButton>
              </Grid>
              <Grid item xs={3}>
                <IconButton
                  onClick={() => {
                    hanldeConfirmDialog(row.row.id, "SalesOfficerWithdrawn");
                  }}
                >
                  <PregnantWomanIcon size="small" />
                </IconButton>
              </Grid>
            </>
          ) : undefined}
        </Grid>
      ),
    },
  ];

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        spacing={3}
        style={{ height: "100vh" }}
      >
        <Grid item>
          <Typography color="primary" variant="h3">
            Cheques
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={fetchRows}>
            <CachedIcon fontSize="large"></CachedIcon>
          </Button>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            rows={rows}
            columns={columns}
            className={classes.table}
            pageSize={5}
            autoHeight
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Grid>
      </Grid>
      {/* Get Header */}
      <Dialog
        open={headerBox}
        onClose={() => setHeaderBox(false)}
        aria-labelledby="Header-dialog-title"
      >
        <DialogTitle id="Header-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select Header for Cheque with which it will be Withdrawn
          </DialogContentText>
          <Selecter
            name="header"
            fw={true}
            title={headerTitle}
            handleChange={(e) => {
              setfields({ ...fields, header: e.target.value });
              const index = e.target.selectedIndex;
              const optionElement = e.target.childNodes[index];
              const optionElementId = optionElement.getAttribute("id");
              const obj = JSON.parse(optionElementId);
              setHeaderTitle(obj.name);
            }}
            value={fields.header}
            onOpen={FetchReciverReleventHeader}
            choises={headers}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHeaderBox(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={ChangeStatus} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm */}
      <Dialog open={confirmBox} onClose={() => setConfirmBox(false)}>
        <DialogTitle id="Dialog">
          Are You sure you want to {fields.type} the Cheque?
        </DialogTitle>

        <DialogActions>
          <Button onClick={() => setConfirmBox(false)} color="default">
            Cancel
          </Button>
          <Button onClick={ConfirmedChange} color="secondary" autoFocus>
            {loading ? <CircularProgress color="secondary" /> : "YES"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
