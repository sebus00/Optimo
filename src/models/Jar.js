import PropTypes from 'prop-types';
import CurrencyPropsTypes from 'models/Currency';

const JarPropsTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  balance: PropTypes.number.isRequired,
  currency: CurrencyPropsTypes,
});

export default JarPropsTypes;
