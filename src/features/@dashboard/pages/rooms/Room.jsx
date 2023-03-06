import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Chip, TableCell, TableRow, Tooltip } from "@mui/material";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import TextTrucate from "~/components/TextTrucate";
import { appActions } from "~/features/app/appSlice";
import { roomActions, roomState } from "~/features/rooms/roomSlice";
import { fCurrency, fNumber, fPrice } from "~/utils/formatNumber";
import { PageLayoutWithTable } from "../../components";
import DialogConfirm from "../../components/DialogConfim";

function Room(props) {
  const { paginations, filters, data, isLoading } = useSelector(roomState);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedDelete, setSelectedDelete] = useState({});

  const dataHead = [
    "Mã phòng",
    "Tên phòng",
    "Loại phòng",
    "Thuộc khách sạn",
    "Giá",
    "Số lượng người",
    "SL Phòng",
    "Đã đặt",
    "Trạng thái",
    "Hành động",
  ];

  useEffect(() => {
    dispatch(roomActions.getAllStart({ ...filters, order: "created_at" }));
  }, [filters]);

  const handleOpenDialogConfirm = useCallback((room) => {
    setSelectedDelete(room);
    setOpen(true);
  }, []);

  const handleDeleteFloor = useCallback((room) => {
    if (!room) return;
    dispatch(appActions.setOpenOverlay(true));
    dispatch(roomActions.deleteStart(room.room_id));
    setSelectedDelete({});
    setOpen(false);
  }, []);

  const handleOnPageChange = useCallback(
    (page) => {
      dispatch(roomActions.setFilter({ ...filters, page }));
    },
    [filters]
  );

  const handleSearchNameFloor = (value) => {
    dispatch(
      roomActions.setDebounceName({
        ...filters,
        search: value,
        page: 1,
      })
    );
  };

  return (
    <>
      {!_.isEmpty(selectedDelete) && (
        <DialogConfirm
          open={open}
          data={selectedDelete}
          name={selectedDelete.floor_name}
          onClose={() => setOpen(false)}
          onConfirm={handleDeleteFloor}
        />
      )}

      <PageLayoutWithTable
        dataHead={dataHead}
        title="Quản lý phòng"
        named="phòng"
        linkToAdd="/manager/room/add"
        loading={isLoading}
        pagination={paginations}
        onPageChange={handleOnPageChange}
        onInputSearchChange={handleSearchNameFloor}
      >
        {data && data.length ? (
          data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Tooltip title={row.room_id} arrow>
                  <div>
                    <TextTrucate text={row.room_id} width={100} />
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell align="right">{row.room_name}</TableCell>
              <TableCell align="right">{row.rt_name}</TableCell>

              <TableCell align="right">{row.hotel_name}</TableCell>
              <TableCell align="right">{fPrice(row.price)}</TableCell>
              <TableCell align="right">{row.max_people}</TableCell>
              <TableCell align="right">{row.room_quantity}</TableCell>
              <TableCell align="right">
                <Chip
                  label={row.room_booking}
                  color={
                    row.room_booking !== row.room_quantity ? "success" : "error"
                  }
                />
              </TableCell>

              <TableCell align="right">
                <Chip
                  label={row.status}
                  color={row.status === "SHOW" ? "success" : "default"}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  component={RouterLink}
                  sx={{ mr: 1 }}
                  to={`/manager/room/update/${row.room_id}`}
                  size="small"
                >
                  <EditIcon />
                </Button>
                <Button
                  component={RouterLink}
                  to="#"
                  color="error"
                  size="small"
                  onClick={() => handleOpenDialogConfirm(row)}
                >
                  <DeleteIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>Không có dữ liệu!</TableCell>
          </TableRow>
        )}
      </PageLayoutWithTable>
    </>
  );
}

Room.propTypes = {};

export default Room;
