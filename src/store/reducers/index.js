const initialState = {
  jars: [
    { id: 1, name: 'Główny', balance: 234.16, currency: { name: 'Dolar', code: 'USD' } },
    { id: 2, name: 'Jedzenie', balance: 343.12, currency: { name: 'Złoty', code: 'PLN' } },
    { id: 3, name: 'Na samochód', balance: 0, currency: { name: 'Rubel', code: 'RUB' } },
    { id: 4, name: 'Podróze', balance: 455.4, currency: { name: 'Euro', code: 'EUR' } },
    { id: 5, name: 'Edukacja', balance: 4300, currency: { name: 'Funt', code: 'PLN' } },
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
  switch (type) {
    case 'ADD_JAR':
      return {
        ...state,
        jars: [
          ...state.jars,
          {
            id: state.jars[state.jars.length - 1].id + 1,
            balance: 0,
            name: 'Bez nazwy',
            currency: state.currencies[0],
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
          if (rest.id === payload.to.id) return { balance: balance + payload.amount, ...rest };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          {
            id: state.history.length > 0 ? state.history[state.history.length - 1].id + 1 : 1,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: payload.to,
            amount: payload.amount,
            currency: payload.to.currency,
          },
        ],
      };
    case 'WITHDRAW':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === payload.from.id) return { balance: balance - payload.amount, ...rest };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          {
            id: state.history.length > 0 ? state.history[state.history.length - 1].id + 1 : 1,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: payload.to,
            amount: payload.amount,
            currency: payload.from.currency,
          },
        ],
      };
    case 'TRANSFER':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === payload.from.id) return { balance: balance - payload.amount, ...rest };
          if (rest.id === payload.to.id) return { balance: balance + payload.amount, ...rest };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          {
            id: state.history.length > 0 ? state.history[state.history.length - 1].id + 1 : 1,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: payload.to,
            amount: payload.amount,
            currency: payload.from.currency,
          },
        ],
      };
    default:
      return state;
  }
};

export default rootReducer;
