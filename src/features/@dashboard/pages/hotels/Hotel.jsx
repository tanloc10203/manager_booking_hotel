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
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import LazyLoadImage from "~/components/LazyLoadImage";
import TextTrucate from "~/components/TextTrucate";
import { appActions } from "~/features/app/appSlice";
import { hotelActions, hotelState } from "~/features/hotels/hotelSlice";
import { PageLayoutWithTable } from "../../components";
import DialogConfirm from "../../components/DialogConfim";

function Hotel() {
  const { paginations, filters, data, isLoading } = useSelector(hotelState);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState({});

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

  const handleOpenDialogConfirm = useCallback((hotel) => {
    setSelectedDelete(hotel);
    setOpen(true);
  }, []);

  const handleDeleteHotel = useCallback((hotel) => {
    if (!hotel) return;
    dispatch(appActions.setOpenOverlay(true));
    dispatch(hotelActions.deleteStart(hotel.hotel_id));
    setSelectedDelete({});
    setOpen(false);
  }, []);

  return (
    <>
      {!_.isEmpty(selectedDelete) && (
        <DialogConfirm
          open={open}
          data={selectedDelete}
          name={selectedDelete.hotel_name}
          onClose={() => setOpen(false)}
          onConfirm={handleDeleteHotel}
        />
      )}
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
                <LazyLoadImage
                  alt=""
                  src={row.hotel_image}
                  sx={{ width: 150, height: 100, borderRadius: "2px" }}
                />
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
                  onClick={() => handleOpenDialogConfirm(row)}
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
    </>
  );
}

export default Hotel;
