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
import { updateComment } from "../../api/api";
import { useParams, useNavigate } from "react-router-dom";

function Comment() {
  let Navigate = useNavigate();
  const { id } = useParams();

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);

  const handleShow1 = () => setShow1(true);

  const [comment, setComment] = useState("");

  useEffect(() => {
    handleShow1();
  }, []);

  const addCommentDetails = async (_id) => {
    
    const a = {
      comment: comment,
    };
    await updateComment(_id, a);

    handleClose1();
    setComment("");
    Navigate("/artical");
  };

  const Close = () => {
    handleClose1();
    Navigate("/artical");
  };

  return (
    <Modal
      show={show1}
      onHide={handleClose1}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>Add Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          background: "#a5cdf",
          color: "-moz-initial",
        }}
      >
        <FormGroup>
          <FormControl>
            <InputLabel htmlFor="my-input">Comment</InputLabel>
            <Input
              onChange={(e) => setComment(e.target.value)}
              name="comment"
              value={comment}
              id="my-input"
            />
          </FormControl>
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          style={{
            background: "#3d8bdb",
            color: "#fff",
          }}
          onClick={Close}
        >
          Close
        </Button>
        <Button
          variant="primary"
          style={{
            background: "#3d8bdb",
            color: "#fff",
          }}
          onClick={() => addCommentDetails(id)}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Comment;
