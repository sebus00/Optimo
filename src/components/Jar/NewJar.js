import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addJarAction } from 'store/actions';
import styled from 'styled-components';
import cx from 'classnames';
import plusImage from 'assets/icons/plus.svg';

const StyledWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  height: 200px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.img`
  max-width: 70%;
  max-height: 70%;
  opacity: 0.75;
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.6, 1),
    opacity 0.15s cubic-bezier(0.4, 0, 0.6, 1);
  cursor: pointer;
  display: block;

  &.mouse-down:not(.disabled) {
    transform: scale(0.75);
  }

  :hover:not(.disabled) {
    opacity: 1;
  }
`;

const NewJar = ({ addJar, disabled }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  return (
    <StyledWrapper>
      <StyledImage
        className={cx({
          disabled,
          'mouse-down': isMouseDown,
        })}
        onMouseDown={() => {
          setIsMouseDown(true);
        }}
        onMouseUp={() => {
          setIsMouseDown(false);
        }}
        onMouseLeave={() => {
          setIsMouseDown(false);
        }}
        src={plusImage}
        alt=""
        onClick={() => {
          if (!disabled) addJar();
        }}
      />
    </StyledWrapper>
  );
};

NewJar.propTypes = {
  addJar: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

NewJar.defaultProps = {
  disabled: false,
};

const mapDispatchToProps = (dispatch) => ({
  addJar: () => dispatch(addJarAction()),
});

export default connect(null, mapDispatchToProps)(NewJar);
