

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
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";

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
  createArtical,
  fetchArtical,
  
  deleteArtical,
 
} from "../../api/api";
import { Link, useNavigate } from "react-router-dom";
import useStyles from "./Styles";
import SearchBar from "material-ui-search-bar";

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
    id: "Artical",
    numeric: true,
    disablePadding: true,
    label: "Artical",
    align: "left",
  },
  {
    id: "username",
    disablePadding: false,
    label: "Name",
    align: "left",
  },
  {
    id: "artical_desc",

    disablePadding: false,
    label: "artical_desc",
    align: "left",
  },
  {
    id: "title",

    disablePadding: false,
    label: "Title",
    align: "left",
  },

  {
    id: "Image",

    disablePadding: false,
    label: "Image",
    align: "left",
  },
  {
    id: "addcomment",

    disablePadding: false,
    label: " Add Cmt",
    align: "left",
  },
  {
    id: "comment",

    disablePadding: false,
    label: "Comments",
    align: "left",
  },
  {
    id: "status",

    disablePadding: false,
    label: "Status",
    align: "left",
  },
  {
    id: "createdAt",

    disablePadding: false,
    label: "Created At",
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

export default function Articals() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [userold] = useState(JSON.parse(localStorage.getItem("profile")));

 

  let Navigate = useNavigate();

  const [pic, setPic] = useState("");

  const [allArticals, setAllArticals] = useState([]);

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [searched, setSearched] = useState("");
  const [title, setTitle] = useState("");
  const [artical_desc, setArtical_desc] = useState("");
  const [username, setUsername] = useState(userold?.result?.name);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);
  const handleShow1 = () => setShow1(true);
  const user = JSON.parse(localStorage.getItem("profile"));

  const addArticalDetails = async () => {
    const a = {
      title: title,
      username: userold?.result?.name,
      creator: userold?.result?._id,
      artical_desc: artical_desc,
      pic: pic,
      status: "Pending",
      email: userold?.result?.email,
    };

    await createArtical(a);
    setTitle("");
    setArtical_desc("");
    setPic("");
    handleClose();
    getAllArticals();
  };

  useEffect(() => {
    getAllArticals();
    if (!user) {
      Navigate("/");
    }
  }, []);

  const getAllArticals = async () => {
    let response = await fetchArtical();

    setAllArticals(response.data);
    
  };

  const deleteArticalData = async (id) => {
    {
      const confirmBox = window.confirm("Do you really want to delete this?");
      if (confirmBox === true) {
        await deleteArtical(id);
        getAllArticals();
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
    XLSX.writeFile(workBook, "ArticalData.xlsx");
  };

  const cancelSearch = () => {
    setSearched("");

    getAllArticals();
  };

  const postDetails = (pics) => {
    if (pics === undefined) {
      alert("Select the picture");
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "kcs");
      fetch("https://api.cloudinary.com/v1_1/kcs/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())

        .then((data) => {
          setPic(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = allArticals.filter((rows) => {
      return rows.username?.toLowerCase().includes(searchedVal.toLowerCase());
    });

    setAllArticals(filteredRows);
  };

  function handleChange(searchVal) {
    if (!searchVal) {
      getAllArticals();
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
        Add Articals
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
          <Modal.Title>Add Artical</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#a5cdf0", color: "-moz-initial" }}>
          <FormGroup>
            <FormControl>
              <InputLabel htmlFor="my-input">Title</InputLabel>
              <Input
                onChange={(e) => setTitle(e.target.value)}
                name="title"
                value={title}
                id="my-input"
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="my-input">Email</InputLabel>
              <Input
                name="email"
                value={userold?.result?.email}
                disabled
                id="my-input"
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="my-input">User Name</InputLabel>
              <Input
                onChange={(e) => setUsername(e.target.value)}
                name="username"
                value={username}
                disabled
                id="my-input"
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="my-input">Discription</InputLabel>
              <Input
                onChange={(e) => setArtical_desc(e.target.value)}
                name="artical_desc"
                value={artical_desc}
                id="my-input"
              />
            </FormControl>

            <FormControl id="pic">
              <InputLabel htmlFor="my-input">Image</InputLabel>
              <Input
                type="file"
                id="my-input"
                name="pic"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
              />
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
            onClick={addArticalDetails}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <SearchBar
        value={searched}
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
                          <TableCell align="right">{index + 1}</TableCell>
                          <TableCell>{artical.username}</TableCell>
                          <TableCell>{artical.artical_desc}</TableCell>
                          <TableCell>{artical.title}</TableCell>
                          <TableCell>
                            {
                              <img
                                style={{
                                  height: "60px",
                                  width: "60px",
                                  borderRadius: "20px",
                                }}
                                src={`${artical.pic}`}
                              />
                            }
                          </TableCell>

                          <TableCell>
                            <Button
                              variant="primary"
                              style={{
                                background: "#fff",
                                color: "#3d8bdb",
                                padding: "10px",
                                margin: "0px",
                                alignItems: "center",
                                size: "50px",
                              }}
                              component={Link}
                              to={`/comment/${artical._id}`}
                              onClick={() => handleShow1()}
                            >
                              <i
                                class="fas fa-comment fa-2x"
                                aria-hidden="true"
                              ></i>
                            </Button>
                          </TableCell>

                          {!artical.comment[0] ? (
                            <>
                              {" "}
                              <TableCell>Not Commented Yet</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>
                                {artical.comment[0]}
                                <br />
                                {artical.comment[1]}
                              </TableCell>
                            </>
                          )}

                          <TableCell>{artical.status}</TableCell>
                          <TableCell>{artical.createdAt}</TableCell>

                          {user?.result?._id === artical?.creator ? (
                            <>
                              <TableCell>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  style={{ marginRight: 10 }}
                                  disabled={artical.DeletedAt}
                                  component={Link}
                                  to={`/edit/${artical._id}`}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  disabled={artical.DeletedAt}
                                  onClick={() => deleteArticalData(artical._id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  style={{ marginRight: 10 }}
                                  disabled={true}
                                  component={Link}
                                  to={`/edit/${artical._id}`}
                                >
                                  Edit
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  disabled={true}
                                  onClick={() => deleteArticalData(artical._id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </>
                          )}
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
