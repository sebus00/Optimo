import PropTypes from 'prop-types';

const JarPropsTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  balance: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
});

export default JarPropsTypes;
