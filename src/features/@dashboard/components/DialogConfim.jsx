import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

export default function DialogConfirm({
  open,
  data,
  name,
  onClose,
  onConfirm,
}) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận trước khi bạn muốn xoá.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>
              Bạn có chắc chắn muốn xoá{" "}
              <strong style={{ color: "red" }}>{name}</strong>?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error" autoFocus>
            Huỷ bỏ
          </Button>
          <Button onClick={() => onConfirm(data)} color="success">
            Đồng ý.
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DialogConfirm.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};
