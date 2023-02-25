import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  LinearProgress,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import LazyLoadImage from "~/components/LazyLoadImage";
import TextTrucate from "~/components/TextTrucate";
import { hotelActions, hotelState } from "~/features/hotels/hotelSlice";
import { PageLayoutWithTable } from "../../components";

function Hotel() {
  const { paginations, filters, data, isLoading } = useSelector(hotelState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hotelActions.getAllStart({ ...filters }));
  }, [filters]);

  const dataHead = [
    "Mã khách sạn",
    "Tên khách sạn",
    "Địa chỉ",
    "Đánh giá",
    "Giới thiệu",
    "Hành động",
  ];

  return (
    <PageLayoutWithTable
      dataHead={dataHead}
      title="Quản lý khách sạn"
      named="Khách sạn"
      linkToAdd="/manager/hotel/add"
      loading={isLoading}
    >
      {data && data.length ? (
        data.map((row, index) => (
          <TableRow
            key={index}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              <LazyLoadImage alt="" src={row.hotel_image} sx={{ width: 100 }} />
            </TableCell>
            <TableCell align="right">{row.hotel_name}</TableCell>
            <TableCell align="right">{row.provice_name}</TableCell>
            <TableCell align="center">{row.hotel_rating}</TableCell>
            <TableCell align="right">
              <TextTrucate text={row.hotel_desc} width={300} />
            </TableCell>
            <TableCell align="right">
              <Button
                component={RouterLink}
                sx={{ mr: 1 }}
                to={`/manager/hotel/update/${row.hotel_id}`}
                variant="outlined"
              >
                <EditIcon />
              </Button>
              <Button
                component={RouterLink}
                to="#"
                color="error"
                variant="outlined"
              >
                <DeleteIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell>Đang tải ...</TableCell>
        </TableRow>
      )}
    </PageLayoutWithTable>
  );
}

export default Hotel;
