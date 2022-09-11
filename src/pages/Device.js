import { useState, useCallback, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { sentenceCase } from 'change-case';
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
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import ConfirmDialog from '../components/ConfirmDialog';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import HTTPService from '../common/httpService';
import { deviceAPI } from '../common/api-endpoints';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { paginationKeys } from '../common/constants';
import toaster from '../common/toastMessage';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'devicdId', label: 'ID', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'configuration', label: 'Configuration', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions' }
];

// ----------------------------------------------------------------------

export default function Device() {
  const [pagination, setPagination] = useState({ ...paginationKeys });
  const [response, setResponse] = useState({});
  const [id, setId] = useState(null);
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const childRef = useRef(null);

  useEffect(() => {
    getDevices();
  }, [pagination]);

  useEffect(() => {
    if (id && status === true) {
      HTTPService.delete(`${deviceAPI}/${id}`).then((res) => {
        toaster.success(res.message);
        getDevices();
      });
      setStatus(false);
    }
    setId(null);
  }, [status]);

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

  const handleClick = (event, id) => {
    event.stopPropagation();
    navigate(`/edit-device/${id}`, { replace: true });
  };

  const handleOnDelete = (event, id) => {
    event.stopPropagation();
    childRef.current.handleClickOpen();
    setId(id);
  };

  const getDevices = useCallback(() => {
    HTTPService.get(deviceAPI, { ...pagination }).then((res) => {
      setResponse(res);
    });
  }, [pagination]);

  const emptyRows =
    pagination.page > 1 ? Math.max(0, pagination.page - 1 * pagination.limit - response.count) : 0;
  const isUserNotFound = response.count === 0;

  return (
    <Page title="Device | DATA MONITORING SYSTEM">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Device
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/add-device"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Device
          </Button>
        </Stack>

        <Card>
          <UserListToolbar filterName={pagination.search} onFilterName={handleFilterByName} />
          <ConfirmDialog ref={childRef} setStatus={setStatus} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} rowCount={response.count} />
                <TableBody>
                  {response.data &&
                    response.data.map((row) => {
                      const { _id, deviceId, name, location, configuration, status } = row;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          onClick={() => {
                            navigate(`/info/${_id}`);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <TableCell align="left">{deviceId}</TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{configuration}KVA</TableCell>
                          <TableCell align="left">{location}</TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={(status === 0 && 'error') || 'success'}>
                              {sentenceCase(status === 0 ? 'inactive' : 'active')}
                            </Label>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(e) => handleClick(e, _id)}
                              sx={{ color: 'text.primary' }}
                            >
                              <Iconify icon="ic:baseline-edit" width={24} height={24} />
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleOnDelete(e, _id)}
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
