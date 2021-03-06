import React from "react";
import moment from "moment";

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
import InputBase from "@material-ui/core/InputBase";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RefreshIcon from "@material-ui/icons/Refresh";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useSelector } from "react-redux";

import { get } from "lodash";

import { useTableStyles, useToolbarStyles, useHeaderStyles } from "./ContainerTable.styles";
import { IRootState } from "../../types/redux/reducerStates.types";

// Return -1 if element b should be on the left of element a
// Return +1 if element b should be on the right of element a
// Return 0 if they are placed correctly
function descendingComparator(a: any, b: any, orderByProperty: any) {
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
function getComparator(order: any, orderByProperty: any) {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderByProperty)
    : (a: any, b: any) => -descendingComparator(a, b, orderByProperty);
}

function stableSort(array: any, comparator: any) {
  const arrayWithIndex = array.map((el: any, index: any) => [el, index]);
  arrayWithIndex.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order; // If order isn't already in place
    return a[1] - b[1];
  });

  return arrayWithIndex.map((el: any) => el[0]);
}

function ContainerTableHeader({ columns, orderBy, order, onRequestSort }: any) {
  const classes = useHeaderStyles();

  const createSortHandler = (property: any) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((column: any) => (
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
                <span className={classes.visuallyHidden}>{order === "desc" ? "sorted descending" : "sorted ascending"}</span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right"></TableCell>
      </TableRow>
    </TableHead>
  );
}

function TableToolbar({ title, onSearchChange, searchValue, onRefetch }: any) {
  const classes = useToolbarStyles();
  return (
    <Toolbar className={classes.root}>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
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
            input: classes.inputInput,
          }}
          value={searchValue}
          onChange={onSearchChange}
          inputProps={{ "aria-label": "search" }}
        />
      </div>
      <Tooltip title="Refetch data">
        <IconButton color="primary" onClick={onRefetch}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      {/* <Tooltip title="Filter list">
        <IconButton aria-label="filter list">
          <FilterListIcon color="primary" />
        </IconButton>
      </Tooltip> */}
    </Toolbar>
  );
}
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props: any) => (
  // @ts-ignore
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

function ContainerTable({ columns, title, data, dense, actions, onRefetch }: any) {
  const classes = useTableStyles();
  const [page, setPage] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(columns[0].field);
  const [selectedContainer, setSelectedContainer] = React.useState<any>(null);
  const [lastUpdatedTooltips, setlastUpdatedTooltips] = React.useState<any>({});
  const [searchValue, setSearchValue] = React.useState("");
  const loadingContainers = useSelector((store: IRootState) => store.containerData.loadingContainers);

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");

    setOrderBy(property);
  };

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (action: any) => {
    setAnchorEl(null);
    action.onClick(selectedContainer);
  };

  const handleOnSearchChange = (event: any) => {
    setSearchValue(event.target.value);
  };

  function searchSort() {
    const searchedData: any = [];
    data.filter((row: any) => {
      // Check all the key value pairs inside each row in the data
      for (const column of columns) {
        const value = get(row, column.field).toString();
        if (value.includes(searchValue)) {
          searchedData.push(row);
          // If one of the values inside the row includes the searchvalue break out in order to not add the same row twice if more values includes the searchValue
          break;
        }
      }
    });
    return searchedData;
  }
  searchSort();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar title={title} onSearchChange={handleOnSearchChange} searchValue={searchValue} onRefetch={onRefetch} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="container table"
          >
            <ContainerTableHeader columns={columns} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {stableSort(searchSort(), getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: any) => {
                  return (
                    <Tooltip
                      key={index}
                      title={lastUpdatedTooltips[row.id] ? lastUpdatedTooltips[row.id] : ""}
                      placement="right"
                      onOpen={() =>
                        setlastUpdatedTooltips({
                          ...lastUpdatedTooltips,
                          [row.id]: moment(row.updateTime).fromNow(),
                        })
                      }
                      arrow
                      enterDelay={500}
                    >
                      <TableRow hover>
                        {columns.map((column: any) => (
                          <TableCell align={column.alignment} key={column.title}>
                            {get(row, column.field)}
                          </TableCell>
                        ))}
                        {row.commandRequestTopic ? (
                          <TableCell align="center">
                            {loadingContainers.includes(row.id) ? (
                              <div style={{ padding: "12px" }}>
                                <CircularProgress size={20} thickness={4} />
                              </div>
                            ) : (
                              <IconButton
                                aria-label="container actions"
                                aria-controls="actions"
                                aria-haspopup="true"
                                onClick={(event: any) => {
                                  setAnchorEl(event.currentTarget);
                                  setSelectedContainer(row);
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        ) : (
                          <TableCell align="right"></TableCell>
                        )}
                      </TableRow>
                    </Tooltip>
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
      <StyledMenu id="actions-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {actions.map((action: any) => (
          <MenuItem key={action.label} onClick={() => handleActionClick(action)}>
            {action.label}
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}

export default ContainerTable;
