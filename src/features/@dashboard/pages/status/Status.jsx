import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, TableCell, TableRow } from "@mui/material";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import TextTrucate from "~/components/TextTrucate";
import { appActions } from "~/features/app/appSlice";
import { statusActions, statusState } from "~/features/status/statusSlice";
import { PageLayoutWithTable } from "../../components";
import DialogConfirm from "../../components/DialogConfim";

function Status(props) {
  const { paginations, filters, data, isLoading } = useSelector(statusState);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedDelete, setSelectedDelete] = useState({});

  const dataHead = [
    "Mã trạng thái",
    "Loại trạng thái",
    "Mô tả",
    "Key",
    "Giá trị",
    "Hành động",
  ];

  useEffect(() => {
    dispatch(statusActions.getAllStart({ ...filters }));
  }, [filters]);

  const handleOpenDialogConfirm = useCallback((device) => {
    setSelectedDelete(device);
    setOpen(true);
  }, []);

  const handleDeleteDevice = useCallback((device) => {
    if (!device) return;
    dispatch(appActions.setOpenOverlay(true));
    dispatch(statusActions.deleteStart(device.status_id));
    setSelectedDelete({});
    setOpen(false);
  }, []);

  const handleOnPageChange = useCallback(
    (page) => {
      dispatch(statusActions.setFilter({ ...filters, page }));
    },
    [filters]
  );

  const handleSearchName = (value) => {
    dispatch(
      statusActions.setDebounceName({
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
          name={selectedDelete.status_id}
          onClose={() => setOpen(false)}
          onConfirm={handleDeleteDevice}
        />
      )}

      <PageLayoutWithTable
        dataHead={dataHead}
        title="Quản lý trạng thái"
        named="Trạng thái"
        linkToAdd="/manager/status/add"
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
                {row.status_id}
              </TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">
                <TextTrucate text={row.desc} />
              </TableCell>
              <TableCell align="right">{row.key}</TableCell>
              <TableCell align="right">{row.value}</TableCell>
              <TableCell align="right">
                <Button
                  component={RouterLink}
                  sx={{ mr: 1 }}
                  to={`/manager/status/update/${row.status_id}`}
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

Status.propTypes = {};

export default Status;
