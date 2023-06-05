import { Button } from '@mui/material';
import { useTableKeyboardNavigation } from '@progress/kendo-react-data-tools';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { Grid, GridColumn, GridToolbar, GRID_COL_INDEX_ATTRIBUTE } from '@progress/kendo-react-grid';
import moment from 'moment';
//excell
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import vaccineApi from '../api/vaccineApi';
import { PageHeader } from '../components';

const Place = () => {
  const [placeList, setPlaceList] = useState([]);
  const [pageSize, setPageSize] = useState(9);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const res = await vaccineApi.getAll24hUser();
        setPlaceList(res);
      } catch (err) {
        console.log(err);
      }
    };
    getPlaces();
  }, []);
  // setup export to excel
  const _export = React.useRef(null);
  const excelExport = () => {
    _export.current.save();
  };
  const tableHeader = [
    {
      field: 'idNumber',
      headerName: 'Username',
      renderCell: (params) => (
        <Button variant='text' component={Link} to={`/user/${params.row.user.id}`}>
          {params.row.user.idNumber}
        </Button>
      ),
      flex: 1,
    },
    {
      field: 'user',
      headerName: 'User last 24h',
      flex: 1,
      renderCell: (params) => {
        return params.value.fullName;
      },
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      valueGetter: (params) => params.row.user.address,
    },
    {
      field: 'vaccine',
      headerName: 'Vaccine',
      flex: 1,
      renderCell: (params) => {
        // console.log(params.value);
        return params.value.name;
      },
    },

    {
      field: 'createdAt',
      headerName: 'time',
      flex: 1,
      renderCell: (params) => moment(params.value).format('DD-MM-YYYY HH:mm:ss'),
    },
  ];
  return (
    <ExcelExport ref={_export} data={placeList} fileName='Lash24h.xlsx'>
      <Grid data={placeList} style={{ height: '420px' }}>
        <PageHeader title='Last User last 24h List' />
        <GridToolbar>
          <button
            title='Export Excel'
            className='k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary'
            onClick={excelExport}
          >
            Export to Excel
          </button>
        </GridToolbar>
        <GridColumn
          field='user.idNumber'
          title='Username'
          flex='1'
          cell={(props) => {
            console.log({ props });
            const field = props.field || '';
            const value = props.dataItem[field] || props.dataItem['user'].idNumber;
            const userId = props.dataItem['user'].id;
            const navigationAttributes = useTableKeyboardNavigation(props.id);
            return (
              <td
                colSpan={props.colSpan}
                role={'gridcell'}
                aria-colindex={props.ariaColumnIndex}
                aria-selected={props.isSelected}
                {...{
                  [GRID_COL_INDEX_ATTRIBUTE]: props.columnIndex,
                }}
                {...navigationAttributes}
              >
                <Button variant='text' component={Link} to={`/user/${userId}`}>
                  {value}
                </Button>
              </td>
            );
          }}
        />
        <GridColumn field='user.fullName' title='Username' flex='1' />
        <GridColumn field='user.address' title='Address' flex='1' />

        <GridColumn field='vaccine.name' title='vaccine' flex='1' />
        <GridColumn
          field='createdAt'
          title='time'
          flex='1'
          //format moment
          cell={(params) => {
            return <td>{moment(params.dataItem.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>;
          }}
        />
      </Grid>
    </ExcelExport>
  );
};

export default Place;
