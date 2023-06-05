import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userApi from '../api/userApi';
import { PageHeader } from '../components';
import moment from 'moment';

const User = () => {
  const [userList, setUserList] = useState([]);
  const [pageSize, setPageSize] = useState(9);
  const [onDelete, setOnDelete] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await userApi.getAll();
        setUserList(res);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);
  // delete user
  const deleteUser = async (id) => {
    try {
      await userApi.delete(id);
      const newUserList = userList.filter((user) => user._id !== id);
      setUserList(newUserList);
    } catch (err) {
      console.log(err);
    }
  };
  // show delete dialog
  const showDeleteDialogHandler = (user) => {
    setShowDeleteDialog(true);
    setSelectedUser(user);
  };
  // hide delete dialog
  const hideDeleteDialogHandler = () => {
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const tableHeader = [
    {
      field: 'idNumber',
      headerName: 'Username',
      renderCell: (params) => (
        <Button variant='text' component={Link} to={`/user/${params.row.id}`}>
          {params.value}
        </Button>
      ),
      width: 170,
    },
    { field: 'fullName', headerName: 'FullName', width: 220 },
    // { field: 'phoneNumber', headerName: 'Phone', width: 170 },
    {
      field: 'vaccine',
      headerName: 'Vaccinated',
      width: 250,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          color={params.value.length > 1 ? 'green' : params.value.length === 1 ? 'orange' : 'red'}
        >
          {params.value.length > 1 && <VerifiedUserIcon />}
          {params.value.length === 1 && <ShieldOutlinedIcon />}
          {params.value.length < 1 && <ErrorOutlineOutlinedIcon />}
          <Typography
            variant='body2'
            sx={{
              marginLeft: '10px',
              fontWeight: '500',
            }}
          >
            Vaccinated with {params.value.length} dove{params.value.length > 1 && 's'}
          </Typography>
        </Box>
      ),
    },
    { field: 'address', headerName: 'Address', width: 250 },
    {
      field: 'createdAt',
      headerName: 'time',
      width: 200,
      renderCell: (params) => {
        return <td>{moment(params.value).format('DD-MM-YYYY HH:mm:ss')}</td>;
      },
    },
    {
      field: '_id',
      headerName: 'Delete',
      width: 140,
      renderCell: (params) => (
        <>
          <LoadingButton
            color='error'
            disableElevation
            startIcon={<DeleteOutlineOutlinedIcon />}
            loading={onDelete}
            onClick={() => deleteUser(params.row.id)}
          >
            Delete
          </LoadingButton>
        </>
      ),
    },
    {
      field: 'id',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button variant='text' component={Link} to={`/user/${params.value}`} startIcon={<OpenInNewOutlinedIcon />}>
          Detail
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title='User list'
        rightContent={
          <Button variant='contained' component={Link} to='/user/create' startIcon={<PersonAddOutlinedIcon />}>
            Create
          </Button>
        }
      />
      <Paper elevation={0}>
        <DataGrid
          autoHeight
          rows={userList}
          columns={tableHeader}
          pageSize={pageSize}
          rowsPerPageOptions={[9, 50, 100]}
          onPageSizeChange={(size) => setPageSize(size)}
          density='comfortable'
          showColumnRightBorder
          showCellRightBorder
          disableSelectionOnClick
        />
      </Paper>
    </>
  );
};

export default User;
