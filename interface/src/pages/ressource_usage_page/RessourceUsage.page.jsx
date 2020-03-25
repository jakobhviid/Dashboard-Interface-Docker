import React from "react";
import socketIOClient from "socket.io-client";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import useStyles from "./RessourceUsage.styles";
import {
  RESSOURCE_USAGE_ENDPOINT,
  NEWEST_STATS_DATA_REQUEST
} from "../../util/socketEvents";

function RessourceUsage() {
  const [serverContainers, setServerContainers] = React.useState(null);

  const io = socketIOClient("http://127.0.0.1:5000");

  React.useEffect(() => {
    io.emit(NEWEST_STATS_DATA_REQUEST);
    io.on(RESSOURCE_USAGE_ENDPOINT, data => {
      console.log(data);
      const servername = data.servername;
      const containers = data.containers;
      setServerContainers({
        ...serverContainers,
        [servername]: [...containers]
      });
    });

    return () => {
      io.close();
    };
  }, []);

  const styleClasses = useStyles();

  return serverContainers == null ? (
    <div style={{ textAlign: "center" }}>
      <CircularProgress color="secondary" />
    </div>
  ) : (
    <React.Fragment>
      {Object.keys(serverContainers).map(servername => (
        <div style={{ marginBottom: "18px" }} key={servername}>
          <Typography variant="h6" id="serverName">
            {servername}
          </Typography>
          <TableContainer component={Paper}>
            <Table className={styleClasses.table} aria-label="containers">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Id</TableCell>
                  <TableCell align="right">CPU %</TableCell>
                  <TableCell align="right">Memory %</TableCell>
                  <TableCell align="right">Net I/O</TableCell>
                  <TableCell align="right">Disk I/O</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serverContainers[servername].map(container => (
                  <TableRow key={container.id}>
                    <TableCell component="th" scope="row">
                      {container.name}
                    </TableCell>
                    <TableCell align="right">{container.id}</TableCell>
                    <TableCell align="right">
                      {container.cpu_percentage}
                    </TableCell>
                    <TableCell align="right">
                      {container.memory_percent}
                    </TableCell>
                    <TableCell align="right">{container.net}</TableCell>
                    <TableCell align="right">{container.disk}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </React.Fragment>
  );
}

export default RessourceUsage;
