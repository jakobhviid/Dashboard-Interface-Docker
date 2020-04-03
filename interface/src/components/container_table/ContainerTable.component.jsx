import React from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import InputBase from '@material-ui/core/InputBase';
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import { get } from "lodash";

import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import FilterListIcon from "@material-ui/icons/FilterList";

import {
  useTableStyles,
  useToolbarStyles,
  useHeaderStyles
} from "./ContainerTable.styles";

// Return -1 if element b should be on the left of element a
// Return +1 if element b should be on the right of element a
// Return 0 if they are placed correctly
function descendingComparator(a, b, orderByProperty) {
  if (get(b, orderByProperty) < get(a, orderByProperty)) {
    return -1;
  }
  if (get(b, orderByProperty) > get(a, orderByProperty)) {
    return 1;
  }
  return 0;
}

// Returns a callable function which takes the two elements to be compared
// and returns either an ascending comparator or a descending comparator with the orderBy injected
function getComparator(order, orderByProperty) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderByProperty)
    : (a, b) => -descendingComparator(a, b, orderByProperty);
}

function stableSort(array, comparator) {
  const arrayWithIndex = array.map((el, index) => [el, index]);
  arrayWithIndex.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order; // If order isn't already in place
    return a[1] - b[1];
  });

  return arrayWithIndex.map(el => el[0]);
}

function ContainerTableHeader({ columns, orderBy, order, onRequestSort }) {
  const classes = useHeaderStyles();

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map(column => (
          <TableCell
            key={column.title}
            align={column.alignment}
            padding="default"
            sortDirection={orderBy === column.field ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.field}
              direction={orderBy === column.field ? order : "asc"}
              onClick={createSortHandler(column.field)}
            >
              {column.title}
              {orderBy === column.title ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right"></TableCell>
      </TableRow>
    </TableHead>
  );
}

function TableToolbar({ title }) {
  const classes = useToolbarStyles();
  return (
    <Toolbar className={classes.root}>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          inputProps={{ "aria-label": "search" }}
        />
      </div>
      <Tooltip title="Filter list">
        <IconButton aria-label="filter list">
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

function ContainerTable({ columns, title, data, dense, actions }) {
  const classes = useTableStyles();
  const [page, setPage] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(columns[0].field);
  const [selectedContainer, setSelectedContainer] = React.useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");

    setOrderBy(property);
  };

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = action => {
    setAnchorEl(null);
    action.onClick(selectedContainer);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar title={title} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="container table"
          >
            <ContainerTableHeader
              columns={columns}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover key={index}>
                      {columns.map(column => (
                        <TableCell align={column.alignment} key={column.title}>
                          {get(row, column.field)}
                        </TableCell>
                      ))}
                      <TableCell align="center">
                        <IconButton
                          aria-label="container actions"
                          aria-controls="actions"
                          aria-haspopup="true"
                          onClick={event => {
                            setAnchorEl(event.currentTarget);
                            setSelectedContainer(row);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <StyledMenu
        id="actions-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {actions.map(action => (
          <MenuItem
            key={action.label}
            onClick={() => handleActionClick(action)}
          >
            {action.label}
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}

export default ContainerTable;
