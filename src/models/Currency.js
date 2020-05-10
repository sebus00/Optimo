import PropTypes from 'prop-types';

const CurrencyPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
});

export default CurrencyPropTypes;
