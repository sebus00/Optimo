import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';

const StyledWrapper = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px;
  width: 100%;
  height: 100px;
  background-color: black;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
`;

const StyledItem = styled.div`
  margin-right: 15px;

  :last-of-type {
    margin-right: 0;
  }

  span {
    margin-left: 5px;
  }
`;

const Header = ({ jars }) => {
  const totalBalance = jars.reduce((acc, { balance }) => {
    return acc + balance;
  }, 0);

  return (
    <StyledWrapper>
      <StyledItem>
        Bilans:
        <NumberFormat
          value={totalBalance.toFixed(2)}
          displayType="text"
          thousandSeparator
          prefix="$"
          renderText={(item) => <span>{item}</span>}
        />
      </StyledItem>
      <StyledItem>
        Ilość słoików:
        <span>{jars.length}</span>
      </StyledItem>
    </StyledWrapper>
  );
};

Header.propTypes = {
  jars: PropTypes.arrayOf(
    PropTypes.shape({
      balance: PropTypes.number,
    }),
  ),
};

Header.defaultProps = {
  jars: [],
};

const mapStateToProps = ({ jars }) => {
  return { jars };
};

export default connect(mapStateToProps)(Header);
