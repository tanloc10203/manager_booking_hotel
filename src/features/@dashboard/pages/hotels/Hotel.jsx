import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, TableCell, TableRow } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PageLayoutWithTable } from "../../components";

function Hotel() {
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const dataHead = [
    "Mã khách sạn",
    "Tên khách sạn",
    "Địa chỉ",
    "Đánh giá",
    "Giới thiệu",
    "Hành động",
  ];

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  return (
    <PageLayoutWithTable
      dataHead={dataHead}
      title="Quản lý khách sạn"
      named="Khách sạn"
      linkToAdd="/manager/hotel/add"
    >
      {rows.map((row, index) => (
        <TableRow
          key={index}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right">{row.calories}</TableCell>
          <TableCell align="right">{row.fat}</TableCell>
          <TableCell align="right">{row.carbs}</TableCell>
          <TableCell align="right">{row.protein}</TableCell>
          <TableCell align="right">
            <Button
              component={RouterLink}
              sx={{ mr: 1 }}
              to="#"
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
      ))}
    </PageLayoutWithTable>
  );
}

export default Hotel;
