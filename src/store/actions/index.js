export const addJarAction = () => {
  return {
    type: 'ADD_JAR',
    payload: {},
  };
};

export const deleteAction = (id) => {
  return {
    type: 'DELETE',
    payload: { id },
  };
};

export const editAction = (id, name) => {
  return {
    type: 'EDIT',
    payload: { id, name },
  };
};

export const depositAction = (to, amount, currency) => {
  return {
    type: 'DEPOSIT',
    payload: { to, amount, currency },
  };
};

export const withdrawAction = (from, amount, currency) => {
  return {
    type: 'WITHDRAW',
    payload: { from, amount, currency },
  };
};

export const transferAction = (from, to, amount, currency) => {
  return {
    type: 'TRANSFER',
    payload: { from, to, amount, currency },
  };
};

export const changeAction = (id, currencyCode) => {
  return {
    type: 'CHANGE',
    payload: { id, currencyCode },
  };
};

export const splitDepositAction = (depositIds, depositAmounts, currency) => {
  return {
    type: 'SPLIT_DEPOSIT',
    payload: { depositIds, depositAmounts, currency },
  };
};
