import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TablePagination } from '@mui/material';

// Ejemplo de datos de registro
const registros = [
  { id: 1, fecha: '2024-11-10', hora: '08:00', cantidad: '10g' },
  { id: 2, fecha: '2024-11-10', hora: '12:00', cantidad: '15g' },
  { id: 3, fecha: '2024-11-10', hora: '18:00', cantidad: '12g' },
  { id: 4, fecha: '2024-11-11', hora: '08:00', cantidad: '10g' },
];

// Ordenación de la tabla
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function HistorialAlimentador() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'id'}
                direction={orderBy === 'id' ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, 'id')}
              >
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'fecha'}
                direction={orderBy === 'fecha' ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, 'fecha')}
              >
                Fecha
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'hora'}
                direction={orderBy === 'hora' ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, 'hora')}
              >
                Hora
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'cantidad'}
                direction={orderBy === 'cantidad' ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, 'cantidad')}
              >
                Cantidad de Alimento
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(registros, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((registro) => (
              <TableRow hover key={registro.id}>
                <TableCell>{registro.id}</TableCell>
                <TableCell>{registro.fecha}</TableCell>
                <TableCell>{registro.hora}</TableCell>
                <TableCell>{registro.cantidad}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={registros.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default HistorialAlimentador;
