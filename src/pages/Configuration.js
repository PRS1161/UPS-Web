import { useState, useCallback, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import HTTPService from '../common/httpService';
import { configurationAPI } from '../common/api-endpoints';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { paginationKeys } from '../common/constants';
import toaster from '../common/toastMessage';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'attribute', label: 'Attribute', alignRight: false },
  { id: 'settings', label: 'Settings', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

export default function Configuration() {
  const [pagination, setPagination] = useState({ ...paginationKeys });
  const [response, setResponse] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getConfiguration();
  }, [pagination]);

  const handleChangePage = (event, newPage) => {
    setPagination({
      ...pagination,
      page: newPage + 1
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({
      ...pagination,
      page: 1,
      limit: parseInt(event.target.value, 10)
    });
  };

  const handleFilterByName = (event) => {
    setPagination({
      ...pagination,
      search: event.target.value
    });
  };

  const deleteConfiguration = (id) => {
    HTTPService.delete(`${configurationAPI}/${id}`).then((res) => {
      toaster.success(res.message);
      getConfiguration();
    });
  };

  const getConfiguration = useCallback(() => {
    HTTPService.get(configurationAPI, { ...pagination }).then((res) => {
      setResponse(res);
    });
  }, [pagination]);

  const emptyRows =
    pagination.page > 1 ? Math.max(0, pagination.page - 1 * pagination.limit - response.count) : 0;
  const isUserNotFound = response.count === 0;

  return (
    <Page title="Configuration | DATA MONITORING SYSTEM">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Configuration
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/add-configuration"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Configuration
          </Button>
        </Stack>

        <Card>
          <UserListToolbar filterName={pagination.search} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={response.count} />
                <TableBody>
                  {response.data &&
                    response.data.map((row) => {
                      const { _id, attribute, settings } = row;

                      return (
                        <TableRow hover key={_id} tabIndex={-1}>
                          <TableCell align="left">{attribute}KVA</TableCell>
                          <TableCell align="left">
                            {settings.map((s, i) => {
                              return <li key={i}>{s.key}</li>;
                            })}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                navigate(`/edit-configuration/${_id}`, { replace: true })
                              }
                              sx={{ color: 'text.primary' }}
                            >
                              <Iconify icon="ic:baseline-edit" width={24} height={24} />
                            </IconButton>
                            <IconButton
                              onClick={() => deleteConfiguration(_id)}
                              sx={{ color: 'text.primary' }}
                            >
                              <Iconify icon="ic:baseline-delete" width={24} height={24} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={pagination.search} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={response.count ? parseInt(response.count, 10) : 0}
            rowsPerPage={pagination.limit}
            page={pagination.page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ overflowX: 'hidden' }}
          />
        </Card>
      </Container>
    </Page>
  );
}
