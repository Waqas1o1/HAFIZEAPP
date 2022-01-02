import { Grid, Typography } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { DataGrid } from "@material-ui/data-grid";
import axiosInstance from "../../apisConfig";
import { toast } from "react-toastify";
export default function RecoveryReport() {
  var date = new Date();
  const initialFields = {
    FromDate:
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    ToDate:
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
  };
  const [fields, setFields] = useState(initialFields);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchReport() {
    return await axiosInstance
      .get(`apis/RecoveryReport/${fields.FromDate}/${fields.ToDate}`)
      .then((res) => {
        let data = res.data;
        if (data["error"] === true) {
          toast.error(`Error Occures ${data["message"]}`);
          setLoading(false);
        } else {
          console.log(data["data"]);
          setRows(data["data"]);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(`Somethin wrong: ${error}`);
      });
  }

  const handleFromDateChange = (date) => {
    var d =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    setFields({
      ...fields,
      FromDate: String(d),
    });
    fetchReport();
  };

  const handleToDateChange = (date) => {
    var d =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    setFields({
      ...fields,
      ToDate: String(d),
    });
    fetchReport();
  };
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "party", headerName: "Customer", width: 200 },
    { field: "Total_Debit", headerName: "Debit", width: 130 },
    { field: "Total_Credit", headerName: "Credit", width: 130 },
    { field: "Balancse", headerName: "Balancse", width: 140 },
    { field: "Last_pay", headerName: "Last Pay", width: 150 },
    { field: "Pay_date", headerName: "Pay Date", width: 150 },
    { field: "Mobile", headerName: "Mobile", width: 150 },
    { field: "Days", headerName: "Days", width: 120 },
    { field: "Pay_date", headerName: "Pay Date", width: 150 },
    { field: "SalesOfficer", headerName: "Market Officer", width: 150 },
    { field: "Promise_date", headerName: "Promise Date", width: 200 },
  ];

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={4}>
      <Grid item>
        <Typography variant="h3" color="primary">
          Recovery Report
        </Typography>
      </Grid>
      <Grid item container spacing={3} alignItems="center">
        
        <Grid item xs={6} md={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              format="yyyy-MM-dd"
              id="ToDate"
              name="ToDate"
              value={fields.FromDate}
              onChange={handleFromDateChange}
              KeyboardButtonProps={{
                "aria-label": "Select From Date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={6} md={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              format="yyyy-MM-dd"
              id="ToDate"
              name="ToDate"
              value={fields.ToDate}
              onChange={handleToDateChange}
              KeyboardButtonProps={{
                "aria-label": "Select ToDate",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <Grid item container>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 50, 100]}
            headerHeight={50}
            disableSelectionOnClick
            loading={loading}
          />
        </div>
      </Grid>
    </Grid>
  );
}
