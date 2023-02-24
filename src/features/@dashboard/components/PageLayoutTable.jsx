import {
  Button,
  Container,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import Page from "~/components/Page";

function LayoutPageWithTable(props) {
  const { children, dataHead, title, linkToAdd, named } = props;

  return (
    <Page title={title}>
      <Container maxWidth="xl">
        <Stack mb={4}>
          <Typography variant="h4" textTransform="uppercase">
            {`Danh sách ${named}`}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
          >
            <TextField
              id="standard-basic"
              label={`Tìm kiếm ${named}`}
              variant="standard"
            />

            <Button component={RouterLink} to={linkToAdd} variant="outlined">
              {`Thêm ${named}`}
            </Button>
          </Stack>

          <Pagination sx={{ mt: 3 }} count={10} />

          <TableContainer sx={{ mt: 2 }} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {dataHead &&
                    dataHead.length > 0 &&
                    dataHead.map((item, index) => {
                      if (index === 0)
                        return <TableCell key={index}>{item}</TableCell>;

                      return (
                        <TableCell align="right" key={index}>
                          {item}
                        </TableCell>
                      );
                    })}
                </TableRow>
              </TableHead>
              <TableBody>{children}</TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </Page>
  );
}

LayoutPageWithTable.propTypes = {
  children: PropTypes.node.isRequired,
  dataHead: PropTypes.array.isRequired,
  title: PropTypes.node.isRequired,
  linkToAdd: PropTypes.node,
  named: PropTypes.node.isRequired,
};

export default LayoutPageWithTable;
