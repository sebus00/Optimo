import React from 'react';
import PropTypes from 'prop-types';
import GlobalStyle from 'theme/GlobalStyle';
import styled from 'styled-components';
import Header from 'components/Header/Header';

const StyledWrapper = styled.div`
  padding-top: 100px;
  width: 100%;
  min-height: 100vh;
  background-color: #e7eae4;
`;

const MainTemplate = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <StyledWrapper>
        <Header />
        {children}
      </StyledWrapper>
    </>
  );
};

MainTemplate.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainTemplate;
