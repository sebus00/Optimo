import PropTypes from 'prop-types';

const HistoryPropsTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  operation: PropTypes.string.isRequired,
  from: PropTypes.number,
  to: PropTypes.number,
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
});

export default HistoryPropsTypes;
