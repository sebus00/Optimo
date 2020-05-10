/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
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
    cursor: 'pointer',
  },
  cellCont: {
    position: 'relative',
    paddingLeft: '1rem',
    whiteSpace: 'nowrap',
    '&:hover': {
      opacity: 0.7,
      '& svg': {
        opacity: 0.5,
      },
    },
  },
  icon: {
    position: 'absolute',
    top: '0.2rem',
    left: '-1rem',
    fontSize: '1.5rem',
    opacity: 0,
    transform: ({ ascendOrder }) => (ascendOrder ? 'none' : 'rotate(180deg)'),
    '&.visible': {
      opacity: '1 !important',
    },
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
  const [sortKey, setSortKey] = useState('id');
  const [ascendOrder, setAscendOrder] = useState(false);

  const sortTable = (field) => {
    if (sortKey !== field) {
      setSortKey(field);
      setAscendOrder(true);
    } else {
      setAscendOrder(!ascendOrder);
    }
  };
  const classes = useStyles({ ascendOrder });

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small">
        <TableHead>
          <TableRow>
            {columns.map(({ title, field }) => (
              <TableCell
                key={field}
                className={classes.head}
                align="center"
                onClick={() => {
                  sortTable(field);
                }}
              >
                <span className={classes.cellCont}>
                  <ArrowUpwardIcon
                    className={cx({
                      [classes.icon]: true,
                      visible: sortKey === field,
                    })}
                  />
                  {title}
                </span>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[]
            .concat(rows)
            .sort((a, b) =>
              a[sortKey] > b[sortKey] ? (ascendOrder ? 1 : -1) : ascendOrder ? -1 : 1,
            )
            .map((item) => (
              <TableRow key={item.id}>
                {columns.map(({ field }) => (
                  <TableCell key={`${field}-${item.id}`} className={classes.cell} align="center">
                    {item[field] instanceof Date ? item[field].toLocaleString() : item[field]}
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
  rows: PropTypes.array,
};

TableComponent.defaultProps = {
  rows: [],
};

export default TableComponent;
