import React, { useState } from 'react';
import PropTypes from 'prop-types';
import JarPropsTypes from 'models/Jar';
import { connect } from 'react-redux';
import { transferAction } from 'store/actions';
import styled from 'styled-components';
import Jar from 'components/Jar/Jar';
import NewJar from 'components/Jar/NewJar';

const StyledWrapper = styled.div`
  padding: 20px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 50px;
`;

const Managment = ({ jars, transferMoney }) => {
  const [state, setState] = useState({ step: 0, from: null, to: null });

  const restartState = () => {
    setState({ step: 0, from: null, to: null });
  };

  const changeState = (newStep, target = null, amount = 0) => {
    switch (newStep) {
      case 0: // no action
        break;
      case 1: // transfer started
        setState({ ...state, step: newStep, from: target });
        break;
      case 2: // transfer target choosen
        setState({
          ...state,
          step: newStep,
          to: target,
        });
        break;
      case 3: // transfer confirmed
        transferMoney(state.from, state.to, amount);
        restartState();
        break;
      case 4: // any other operation started
        setState({
          ...state,
          step: newStep,
        });
        break;
      case 5: // any operation ended or cancelled
        restartState();
        break;
      default:
        break;
    }
  };

  return (
    <StyledWrapper>
      <NewJar disabled={state.step !== 0} />
      {jars.map((jar) => (
        <Jar jar={jar} key={jar.id} state={state} stateChangeHandler={changeState} />
      ))}
    </StyledWrapper>
  );
};

Managment.propTypes = {
  jars: PropTypes.arrayOf(JarPropsTypes),
  transferMoney: PropTypes.func.isRequired,
};

Managment.defaultProps = {
  jars: [],
};

const mapStateToProps = ({ jars }) => {
  return { jars };
};

const mapDispatchToProps = (dispatch) => ({
  transferMoney: (sender, receiver, amount) => dispatch(transferAction(sender, receiver, amount)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Managment);
