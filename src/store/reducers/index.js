const initialState = {
  jars: [
    { id: 1, name: 'Główny', balance: 234.16 },
    { id: 2, name: 'Jedzenie', balance: 343.12 },
    { id: 3, name: 'Na samochód', balance: 0 },
    { id: 4, name: 'Podróze', balance: 455.4 },
    { id: 5, name: 'Edukacja', balance: 4300 },
  ],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_JAR':
      return {
        ...state,
        jars: [...state.jars, { id: state.jars[state.jars.length - 1].id + 1, balance: 0 }],
      };
    case 'TRANSFER':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === action.payload.from)
            return { balance: balance - action.payload.amount, ...rest };
          if (rest.id === action.payload.to)
            return { balance: balance + action.payload.amount, ...rest };
          return { balance, ...rest };
        }),
      };
    case 'DELETE':
      return {
        ...state,
        jars: state.jars.filter((item) => item.id !== action.payload.id),
      };
    case 'EDIT':
      return {
        ...state,
        jars: state.jars.map((item) => {
          if (item.id === action.payload.id) return { ...item, name: action.payload.name };
          return item;
        }),
      };
    case 'DEPOSIT':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === action.payload.to)
            return { balance: balance + action.payload.amount, ...rest };
          return { balance, ...rest };
        }),
      };
    case 'WITHDRAW':
      return {
        ...state,
        jars: state.jars.map(({ balance, ...rest }) => {
          if (rest.id === action.payload.from)
            return { balance: balance - action.payload.amount, ...rest };
          return { balance, ...rest };
        }),
      };
    default:
      return state;
  }
};

export default rootReducer;
