import PropTypes from 'prop-types';

const CurrencyPropTypes = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

export default CurrencyPropTypes;
