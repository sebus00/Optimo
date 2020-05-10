const initialState = {
  jars: [
    { id: 1, name: 'Główny', balance: 23416, currency: 'USD' },
    { id: 2, name: 'Jedzenie', balance: 3432, currency: 'PLN' },
    { id: 3, name: 'Na samochód', balance: 0, currency: 'RUB' },
    { id: 4, name: 'Podróze', balance: 4554, currency: 'EUR' },
    { id: 5, name: 'Edukacja', balance: 54300, currency: 'PLN' },
  ],
  history: [],
  currencies: [
    { name: 'Złoty', code: 'PLN' },
    { name: 'Euro', code: 'EUR' },
    { name: 'Dolar', code: 'USD' },
    { name: 'Funt', code: 'GBP' },
    { name: 'Frank', code: 'CHF' },
    { name: 'Jen', code: 'JPY' },
    { name: 'Rubel', code: 'RUB' },
  ],
};

const rootReducer = (state = initialState, { type, payload }) => {
  const lastHistoryId = state.history.length > 0 ? state.history[state.history.length - 1].id : 0;
  const lastJarId = state.jars.length > 0 ? state.jars[state.jars.length - 1].id : 0;

  switch (type) {
    case 'ADD_JAR':
      return {
        ...state,
        jars: [
          ...state.jars,
          {
            id: lastJarId + 1,
            name: 'Bez nazwy',
            balance: 0,
            currency: state.currencies[0].code,
          },
        ],
      };
    case 'DELETE':
      return {
        ...state,
        jars: state.jars.filter((item) => item.id !== payload.id),
      };
    case 'EDIT':
      return {
        ...state,
        jars: state.jars.map((item) => {
          if (item.id === payload.id) return { ...item, name: payload.name };
          return item;
        }),
      };
    case 'DEPOSIT':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === payload.to)
            return { balance: balance + Math.round(payload.amount * 100), ...rest };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          {
            id: lastHistoryId + 1,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: payload.to,
            amount: Math.round(payload.amount * 100),
            currency: payload.currency,
          },
        ],
      };
    case 'WITHDRAW':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === payload.from)
            return { balance: balance - Math.round(payload.amount * 100), ...rest };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          {
            id: lastHistoryId + 1,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: payload.to,
            amount: Math.round(payload.amount * 100),
            currency: payload.currency,
          },
        ],
      };
    case 'TRANSFER':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === payload.from)
            return { balance: balance - Math.round(payload.amount * 100), ...rest };
          if (rest.id === payload.to)
            return { balance: balance + Math.round(payload.amount * 100), ...rest };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          {
            id: lastHistoryId + 1,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: payload.to,
            amount: Math.round(payload.amount * 100),
            currency: payload.currency,
          },
        ],
      };
    case 'CHANGE':
      return {
        ...state,
        jars: state.jars.map((item) => {
          if (item.id === payload.id)
            return {
              ...item,
              currency: payload.currencyCode,
            };
          return item;
        }),
      };
    default:
      return state;
    case 'SPLIT_DEPOSIT':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (payload.depositIds.includes(rest.id))
            return {
              balance:
                balance +
                Math.round(payload.depositAmounts[payload.depositIds.indexOf(rest.id)] * 100),
              ...rest,
            };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          ...payload.depositIds.map((item, index) => ({
            id: lastHistoryId + 1 + index,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: item,
            amount: Math.round(payload.depositAmounts[index] * 100),
            currency: payload.currency,
          })),
        ],
      };
  }
};

export default rootReducer;
