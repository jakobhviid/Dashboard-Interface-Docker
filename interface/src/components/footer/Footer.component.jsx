import React from "react";

import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";

function Footer() {
  return (
    <Box pt={4} style={{ marginTop: "128px" }}>
      <Typography variant="body2" color="textSecondary" align="center">
        <Link color="inherit" href="https://hub.docker.com/">
          TODO - LinkToDockerContainerDocumentation
        </Link>{" "}
        {"Copyright © "}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}

export default Footer;
