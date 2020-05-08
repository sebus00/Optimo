import React from 'react';
import PropTypes from 'prop-types';
import GlobalStyle from 'theme/GlobalStyle';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from 'theme/mainTheme';
import Header from 'components/Header/Header';

const StyledWrapper = styled.div`
  padding-top: 100px;
  width: 100%;
  min-height: 100vh;
`;

const MainTemplate = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <StyledWrapper>
          <Header />
          {children}
        </StyledWrapper>
      </ThemeProvider>
    </>
  );
};

MainTemplate.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainTemplate;
