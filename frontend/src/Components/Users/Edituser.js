import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect, ngOnInit } from "react";
import {
  FormGroup,
  FormControl,
  InputLabel,
  Input,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { getArtical, updateArtical } from "../../api/api";

import { useParams, useNavigate } from "react-router-dom";
import { validEmail, validName } from "../../js/RegEx";

const initialValue = {
  username: "",
  email: "",
  status: " ",
};

const initialIsValidValue = {
  isname: "",
  isemail: "",
};

function Edituser() {
  let Navigate = useNavigate();
  const [articals, setArtical] = useState(initialValue);
  const { username, email, status } = articals;
  const [isValid, setIsValid] = useState(initialIsValidValue);
  const { isname, isemail } = isValid;
  const validationMessageCSS = { color: "red", marginBottom: "20px" };

  const { id } = useParams();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    handleShow();
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    const response = await getArtical(id);
    setArtical(response.data);
  };

  const EditUser = async (id) => {
    await updateArtical(id, articals);

    handleClose();
    Navigate("/user");
  };

  const handleClose1 = () => {
    handleClose();
    Navigate("/user");
  };

  const onChangeSetState = (e) => {
    setArtical({ ...articals, [e.target.name]: e.target.value });
  };

  const onValidate = (e, regEx) => {
    const RegExObj = new RegExp(regEx);
    const isValidKey = "is" + e.target.name;

    if (e.target.value === "" || RegExObj.test(e.target.value)) {
      setIsValid({ ...isValid, [isValidKey]: "" });
      setArtical({ ...articals, [e.target.name]: e.target.value });
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

  function validateDetails(id) {
    if (validateDetailsFlag) {
      EditUser(id);
    } else {
      alert("Invalid input..!!");
    }
  }
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#a5cdf0", color: "-moz-initial" }}>
          <FormGroup>
            <FormControl>
              <InputLabel htmlFor="my-input">Name</InputLabel>
              <Input
                onChange={(e) => onChangeSetState(e)}
                onBlur={(e) => onValidate(e, validName)}
                name="username"
                value={username}
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
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleClose1()}
            style={{ background: "#3d8bdb", color: "#fff" }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => validateDetails(id)}
            style={{ background: "#3d8bdb", color: "#fff" }}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Edituser;
