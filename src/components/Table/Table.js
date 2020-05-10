/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Select from 'components/Select/Select';

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
});

const StyledSelectWrapper = styled.div`
  margin: 5px 20px 20px;
`;

const TableComponent = ({ columns, rows, itemsToFilter, keysToFilter }) => {
  const [sortKey, setSortKey] = useState('id');
  const [ascendOrder, setAscendOrder] = useState(false);
  const [filter, setFilter] = useState('');

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
      {itemsToFilter.length > 0 && (
        <StyledSelectWrapper>
          <Select
            label="Nazwa słoika"
            helperText="Sortuj po nazwie"
            value={filter}
            changeHandler={({ target: { value } }) => setFilter(value)}
            items={[
              { name: 'Wszystkie', value: '' },
              ...itemsToFilter.map((item) => ({ name: item, value: item })),
            ]}
          />
        </StyledSelectWrapper>
      )}
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
            .filter((item) =>
              filter ? keysToFilter.map((key) => item[key]).includes(filter) : item,
            )
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
  itemsToFilter: PropTypes.array,
  keysToFilter: PropTypes.arrayOf(PropTypes.string),
};

TableComponent.defaultProps = {
  rows: [],
  itemsToFilter: [],
  keysToFilter: [],
};

export default TableComponent;
