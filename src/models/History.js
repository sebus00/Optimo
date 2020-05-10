import PropTypes from 'prop-types';
import CurrencyPropsTypes from 'models/Currency';
import JarPropsTypes from 'models/Jar';

const HistoryPropsTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  operation: PropTypes.string.isRequired,
  from: JarPropsTypes,
  to: JarPropsTypes,
  amount: PropTypes.number.isRequired,
  currency: CurrencyPropsTypes,
});

export default HistoryPropsTypes;
