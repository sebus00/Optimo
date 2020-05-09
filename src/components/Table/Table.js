import React from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  cell: {
    fontSize: '1.3rem',
    position: 'relative',
  },
  head: {
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  transferIcon: {
    fontSize: '2.3rem',
    color: 'green',
    position: 'absolute',
    top: '0.4rem',
    marginLeft: '5px',
    '&.reversed': {
      color: 'red',
      transform: 'rotate(180deg)',
    },
  },
});

const TableComponent = ({ columns, rows }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            {columns.map(({ title, field }) => (
              <TableCell key={field} className={classes.head} align="center">
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id}>
              {columns.map(({ field }) => (
                <TableCell key={`${field}-${item.id}`} className={classes.cell} align="center">
                  {item[field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TableComponent.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
    }),
  ).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array,
};

TableComponent.defaultProps = {
  rows: [],
};

export default TableComponent;
