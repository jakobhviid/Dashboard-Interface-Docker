import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Container, Paper, Tabs, Tab, Box } from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import KeyIcon from "@material-ui/icons/VpnKey";
import useStyles from "./Kerberos.styles";
import SecurityIcon from "@material-ui/icons/Security";
import CreateKerberosKeys from "./CreateKerberosKeys.component";
import DownloadKeytabs from "./DownloadKeytabs.component";
import SecurityManagerTab from "./SecurityManager.component";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function KerberosPage() {
  const [activeTab, setActiveTab] = useState("one");

  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Container maxWidth="md">
      <Paper square className={classes.root}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => {
            setActiveTab(newValue);
          }}
          indicatorColor="secondary"
          textColor="primary"
          centered
        >
          <Tab value="one" icon={<LockIcon color="secondary" />} label="CREATE KEYTABS" />
          <Tab value="two" icon={<KeyIcon color="secondary" />} label="DOWNLOAD KEYTABS" />
          <Tab value="three" icon={<SecurityIcon color="secondary" />} label="SECURITY-MANAGER" />
        </Tabs>
      </Paper>
      <TabPanel value={activeTab} index="one">
        <CreateKerberosKeys />
      </TabPanel>
      <TabPanel value={activeTab} index="two">
        <DownloadKeytabs />
      </TabPanel>
      <TabPanel value={activeTab} index="three">
        <SecurityManagerTab />
      </TabPanel>
    </Container>
  );
}

export default KerberosPage;
