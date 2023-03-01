import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const ImageStyle = styled("img")(({ theme }) => ({
  transition: "0.5s ease-in-out .5s",
  opacity: 0,
  visibility: "hidden",
  background: "rgba(0,0,0,0.2)",

  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",

  "&.active": {
    opacity: 1,
    visibility: "visible",
  },
}));

const BoxStyle = styled(Box)(({ theme }) => ({
  background: "rgba(0,0,0,0.2)",
  width: "100%",
  height: "100%",
  textDecoration: "none",
  color: "inherit",

  "&.active": {
    background: "unset",
  },
}));

function LazyLoadImage({ src, alt, component, sx, children, ...others }) {
  const imgRef = useRef();
  const boxRef = useRef();

  useEffect(() => {
    const img = imgRef.current;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        img && img.setAttribute("src", src);
        img && img.classList.add("active");
        img && img.classList.add("active");
        img && boxRef.current.classList.add("active");
      }
    });

    if (img) {
      observer.observe(img);
    }

    return () => {
      if (img) observer.unobserve(img);
    };
  }, [src]);

  return (
    <BoxStyle component={component} ref={boxRef} sx={sx} {...others}>
      <ImageStyle sx={sx} ref={imgRef} alt={alt} {...others} />

      {children}
    </BoxStyle>
  );
}

LazyLoadImage.propTypes = {
  alt: PropTypes.string,
  component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.any,
  ]),
};

LazyLoadImage.defaultProps = {
  component: "div",
};

export default LazyLoadImage;
