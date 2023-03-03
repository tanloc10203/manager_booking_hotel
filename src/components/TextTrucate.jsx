import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

function TextTrucate({ text, lineShow, width }) {
  return (
    <Typography
      sx={{
        display: "-webkit-box",
        WebkitLineClamp: lineShow || 1,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordBreak: "break-word",
        width: width || 300,
      }}
    >
      {text}
    </Typography>
  );
}

TextTrucate.propTypes = {
  text: PropTypes.string.isRequired,
  lineShow: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TextTrucate;
