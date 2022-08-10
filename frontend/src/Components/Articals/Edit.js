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

import { useParams, useNavigate } from "react-router-dom";
import { updateArtical, getArtical } from "../../api/api";

const initialValue = {
  title: "",
  artical_desc: "",
  username: " ",
};
function Edit() {
  let Navigate = useNavigate();
  const [articals, setArtical] = useState(initialValue);
  const { title, artical_desc, username } = articals;

  const { id } = useParams();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    handleShow();
    loadArticalDetails();
  }, []);

  const loadArticalDetails = async () => {
    const response = await getArtical(id);
    setArtical(response.data);
  };

  const onValueChange = (e) => {
    setArtical({ ...articals, [e.target.name]: e.target.value });
  };

  const EditArtical = async (id) => {
    await updateArtical(id, articals);

    handleClose();
    Navigate("/artical");
  };

  const handleClose1 = () => {
    handleClose();
    Navigate("/artical");
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Edit Artical</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#a5cdf0", color: "-moz-initial" }}>
          <FormGroup>
            <FormControl>
              <InputLabel htmlFor="my-input">Title</InputLabel>
              <Input
                onChange={(e) => onValueChange(e)}
                name="title"
                value={title}
                id="my-input"
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="my-input">User Name</InputLabel>
              <Input
                onChange={(e) => onValueChange(e)}
                name="username"
                value={username}
                disabled
                id="my-input"
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="my-input">Discription</InputLabel>
              <Input
                onChange={(e) => onValueChange(e)}
                name="artical_desc"
                value={artical_desc}
                id="my-input"
              />
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
            onClick={() => EditArtical(id)}
            style={{ background: "#3d8bdb", color: "#fff" }}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Edit;
