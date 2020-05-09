const initialState = {
  jars: [
    { id: 1, name: 'Główny', balance: 234.16 },
    { id: 2, name: 'Jedzenie', balance: 343.12 },
    { id: 3, name: 'Na samochód', balance: 0 },
    { id: 4, name: 'Podróze', balance: 455.4 },
    { id: 5, name: 'Edukacja', balance: 4300 },
  ],
  history: [
    {
      id: 1,
      operation: 'DEPOSIT',
      date: new Date(94435345433),
      from: null,
      to: 1,
      amount: 44,
    },
    {
      id: 2,
      operation: 'TRANSFER',
      date: new Date(14435345433),
      from: 2,
      to: 1,
      amount: 1673.23,
    },
    {
      id: 3,
      operation: 'TRANSFER',
      date: new Date(44435345433),
      from: 5,
      to: 4,
      amount: 73.23,
    },
  ],
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'ADD_JAR':
      return {
        ...state,
        jars: [...state.jars, { id: state.jars[state.jars.length - 1].id + 1, balance: 0 }],
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
          if (rest.id === payload.to) return { balance: balance + payload.amount, ...rest };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          {
            id: state.history[state.history.length - 1].id + 1,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: payload.to,
            amount: payload.amount,
          },
        ],
      };
    case 'WITHDRAW':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === payload.from) return { balance: balance - payload.amount, ...rest };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          {
            id: state.history[state.history.length - 1].id + 1,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: payload.to,
            amount: payload.amount,
          },
        ],
      };
    case 'TRANSFER':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === payload.from) return { balance: balance - payload.amount, ...rest };
          if (rest.id === payload.to) return { balance: balance + payload.amount, ...rest };
          return { balance, ...rest };
        }),
        history: [
          ...state.history,
          {
            id: state.history[state.history.length - 1].id + 1,
            date: new Date(),
            operation: type,
            from: payload.from,
            to: payload.to,
            amount: payload.amount,
          },
        ],
      };
    default:
      return state;
  }
};

export default rootReducer;
