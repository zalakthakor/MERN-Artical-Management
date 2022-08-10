import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";

import SendIcon from "@mui/icons-material/Send";

import {
  FormGroup,
  Button,
  FormControl,
  InputLabel,
  Input,
  TextField,
} from "@material-ui/core";
import * as XLSX from "xlsx";
import {
  fetchArtical,
  deleteArtical,
  createUser,
  updatestatus,
} from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

import SearchBar from "material-ui-search-bar";
import { validEmail, validName, validPassword } from "../../js/RegEx";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "No",
    numeric: true,
    disablePadding: true,
    label: "No",
    align: "left",
  },
  {
    id: "name",
    disablePadding: false,
    label: "Name",
    align: "left",
  },
  {
    id: "email",

    disablePadding: false,
    label: "email",
    align: "left",
  },
  {
    id: "Title",

    disablePadding: false,
    label: "title",
    align: "left",
  },
  {
    id: "Image",

    disablePadding: false,
    label: "pic",
    align: "left",
  },
  {
    id: "artical_desc",

    disablePadding: false,
    label: "Artical_desc",
    align: "left",
  },
  {
    id: "createdAt",

    disablePadding: false,
    label: "Created_At",
    align: "left",
  },

  {
    id: "status",

    disablePadding: false,
    label: "status",
    align: "left",
  },

  {
    id: "Edit",

    disablePadding: false,
    label: "Edit",
    align: "left",
  },
  {
    id: "Delete",

    disablePadding: false,
    label: "Delete",
    align: "left",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            scope={headCell}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function Users() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const validationMessageCSS = { color: "red", marginBottom: "20px" };

  let Navigate = useNavigate();

  const [allArticals, setAllArticals] = useState([]);

  const [show, setShow] = useState(false);

  const [searched, setSearched] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const user1 = JSON.parse(localStorage.getItem("profile"));
  const initialIsValidValue = {
    isname: "",
    isemail: "",

    ispassword: "",
  };

  const initialValue = {
    name: "",
    email: "",
    status: "",
    password: "",
  };

  const [user, setUser] = useState(initialValue);
  const { name, email, status, password } = user;
  const [isValid, setIsValid] = useState(initialIsValidValue);
  const { isname, isemail, isstatus, ispassword } = isValid;

  const addUserDetails = async () => {
    await createUser(user);
    handleClose();
    getAllUsers();
  };

  useEffect(() => {
    getAllUsers();
    if (!user1) {
      Navigate("/");
    }
  }, []);

  const getAllUsers = async () => {
    let response = await fetchArtical();

    setAllArticals(response.data);
  };

  const deleteUserData = async (id) => {
    {
      const confirmBox = window.confirm("Do you really want to delete this?");
      if (confirmBox === true) {
        await deleteArtical(id);
        getAllUsers();
      }
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allArticals.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const Export = () => {
    const workSheet = XLSX.utils.json_to_sheet(allArticals);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Articals");

    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workBook, "UserData.xlsx");
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
    getAllUsers();
  };

  const onChangeSetState = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onValidate = (e, regEx) => {
    const RegExObj = new RegExp(regEx);
    const isValidKey = "is" + e.target.name;

    if (e.target.value === "" || RegExObj.test(e.target.value)) {
      setIsValid({ ...isValid, [isValidKey]: "" });
      setUser({ ...user, [e.target.name]: e.target.value });
    } else {
      setIsValid({ ...isValid, [isValidKey]: "Invalid input..!!" });
    }
  };

  var flag = true;
  const validateDetailsFlag = Object.values(isValid).every((value) => {
    if (value !== null && value !== "") {
      flag = false;
    }
    return flag;
  });

  function validateDetails() {
    if (validateDetailsFlag) {
      addUserDetails();
    } else {
      alert("Invalid input..!!");
    }
  }

  function status1(id) {
    updatestatus(id);

    getAllUsers();
  }

  const requestSearch = (searchedVal) => {
    const filteredRows = allArticals.filter((rows) => {
      return rows.username.toLowerCase().includes(searchedVal.toLowerCase());
    });

    setAllArticals(filteredRows);
  };

  function handleChange(searchVal) {
    if (!searchVal) {
      getAllUsers();
    } else {
      requestSearch(searchVal);
    }
  }

  return (
    <>
      <Button
        variant="primary"
        style={{
          background: "#3d8bdb",
          color: "#fff",
          padding: "10px",
          margin: "10px",
        }}
        onClick={handleShow}
      >
        Add User
      </Button>

      <Button
        variant="primary"
        style={{
          background: "#3d8bdb",
          color: "#fff",
          padding: "10px",
          margin: "20px",
        }}
        onClick={Export}
      >
        Export EXEL
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: "#a5cdf0", color: "-moz-initial" }}>
          <FormGroup>
            <FormControl>
              <InputLabel htmlFor="my-input">Name</InputLabel>
              <Input
                onChange={(e) => onValidate(e, validName)}
                onBlur={(e) => onValidate(e, validName)}
                name="name"
                value={name}
                id="my-input"
                inputProps={{ maxLength: 40 }}
              />
              <div style={validationMessageCSS}>{isname}</div>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="my-input">Email</InputLabel>
              <Input
                onChange={(e) => onChangeSetState(e)}
                onBlur={(e) => onValidate(e, validEmail)}
                name="email"
                value={email}
                id="my-input"
                inputProps={{ maxLength: 50 }}
              />
              <div style={validationMessageCSS}>{isemail}</div>
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="my-input">Password</InputLabel>
              <Input
                type="password"
                onChange={(e) => onChangeSetState(e)}
                onBlur={(e) => onValidate(e, validPassword)}
                name="password"
                value={password}
                id="my-input"
                inputProps={{ maxLength: 12 }}
              />
              <div style={validationMessageCSS}>{ispassword}</div>
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="my-input">Status</InputLabel>
              <Input
                onChange={(e) => onValidate(e, validName)}
                onBlur={(e) => onValidate(e, validName)}
                name="status"
                value={status}
                id="my-input"
                inputProps={{ maxLength: 40 }}
              />
              <div style={validationMessageCSS}>{isstatus}</div>
            </FormControl>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ background: "#3d8bdb", color: "#fff" }}
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            style={{ background: "#3d8bdb", color: "#fff" }}
            onClick={() => validateDetails()}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <SearchBar
        value={searched}
        // onChange={(searchVal) => requestSearch(searchVal)}
        onChange={(searchVal) => handleChange(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={allArticals.length}
              />
              <TableBody>
                {stableSort(allArticals, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                  .map((artical, index) => {
                    return (
                      <>
                        <TableRow
                          style={{
                            backgroundColor: artical.DeletedAt
                              ? "#8cb8de"
                              : "transparent",

                            padding: artical.DeletedAt ? "10px" : 0,

                            boxShadow: artical.DeletedAt
                              ? "2px 0px 8px #9999c2 inset"
                              : "none",
                          }}
                        >
                          <>
                            <TableCell align="right">{index + 1}</TableCell>
                            <TableCell>{artical.username}</TableCell>
                            <TableCell>{artical.email}</TableCell>
                            <TableCell>{artical.title}</TableCell>
                            <TableCell>
                              {
                                <img
                                  style={{
                                    height: "60px",
                                    width: "60px",
                                    borderRadius: "",
                                  }}
                                  src={`${artical.pic}`}
                                />
                              }
                            </TableCell>
                            <TableCell>{artical.artical_desc}</TableCell>
                            <TableCell>{artical.createdAt}</TableCell>

                            {artical.status === "Approved" ? (
                              <>
                                {" "}
                                <TableCell>
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    style={{ marginRight: 10 }}
                                    disabled={true}
                                  >
                                    {artical.status}
                                  </Button>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                {" "}
                                <TableCell>
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    style={{ marginRight: 10 }}
                                    onClick={() => status1(artical._id)}
                                  >
                                    {artical.status}
                                  </Button>
                                </TableCell>
                              </>
                            )}

                            <TableCell>
                              <Button
                                color="primary"
                                variant="contained"
                                style={{ marginRight: 10 }}
                                disabled={artical.DeletedAt}
                                component={Link}
                                endIcon={<SendIcon />}
                                to={`/edituser/${artical._id}`}
                              >
                                Edit
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                startIcon={<DeleteIcon />}
                                color="primary"
                                variant="contained"
                                disabled={artical.DeletedAt}
                                onClick={() => deleteUserData(artical._id)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </>
                        </TableRow>
                      </>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allArticals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
}
