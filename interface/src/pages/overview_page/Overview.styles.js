import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  paper: {
    marginBottom: "16px",
  },
  menuPaper: {
    border: "1px solid #d3d4d5",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabIcon: {
    marginRight: theme.spacing(1),
  },
}));
