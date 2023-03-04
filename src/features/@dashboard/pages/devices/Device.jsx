import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, TableCell, TableRow } from "@mui/material";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import TextTrucate from "~/components/TextTrucate";
import { appActions } from "~/features/app/appSlice";
import { deviceActions, deviceState } from "~/features/devices/deviceSlice";
import { PageLayoutWithTable } from "../../components";
import DialogConfirm from "../../components/DialogConfim";

function Device(props) {
  const { paginations, filters, data, isLoading } = useSelector(deviceState);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedDelete, setSelectedDelete] = useState({});

  const dataHead = [
    "Mã thiết bị",
    "Tên thiết bị",
    "Mô tả",
    "Người tạo",
    "Quyền người tạo",
    "Hành động",
  ];

  useEffect(() => {
    dispatch(deviceActions.getAllStart({ ...filters }));
  }, [filters]);

  const handleOpenDialogConfirm = useCallback((device) => {
    setSelectedDelete(device);
    setOpen(true);
  }, []);

  const handleDeleteDevice = useCallback((device) => {
    if (!device) return;
    dispatch(appActions.setOpenOverlay(true));
    dispatch(deviceActions.deleteStart(device.dt_id));
    setSelectedDelete({});
    setOpen(false);
  }, []);

  const handleOnPageChange = useCallback(
    (page) => {
      dispatch(deviceActions.setFilter({ ...filters, page }));
    },
    [filters]
  );

  const handleSearchName = (value) => {
    dispatch(
      deviceActions.setDebounceName({
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
          name={selectedDelete.dt_name}
          onClose={() => setOpen(false)}
          onConfirm={handleDeleteDevice}
        />
      )}

      <PageLayoutWithTable
        dataHead={dataHead}
        title="Quản lý Thiết bị"
        named="Thiết bị"
        linkToAdd="/manager/device/add"
        loading={isLoading}
        pagination={paginations}
        onPageChange={handleOnPageChange}
        onInputSearchChange={handleSearchName}
      >
        {data && data.length ? (
          data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.dt_id}
              </TableCell>
              <TableCell align="right">{row.dt_name}</TableCell>
              <TableCell align="right">
                <TextTrucate text={row.dt_desc} sx={{ ml: "auto" }} />
              </TableCell>
              <TableCell align="right">
                {row.first_name + " " + row.last_name}
              </TableCell>
              <TableCell align="right">{row.role}</TableCell>
              <TableCell align="right">
                <Button
                  component={RouterLink}
                  sx={{ mr: 1 }}
                  to={`/manager/device/update/${row.dt_id}`}
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

Device.propTypes = {};

export default Device;
