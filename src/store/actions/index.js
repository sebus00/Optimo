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

export const depositAction = (to, amount) => {
  return {
    type: 'DEPOSIT',
    payload: { to, amount },
  };
};

export const withdrawAction = (from, amount) => {
  return {
    type: 'WITHDRAW',
    payload: { from, amount },
  };
};

export const transferAction = (from, to, amount) => {
  return {
    type: 'TRANSFER',
    payload: { from, to, amount },
  };
};

export const changeAction = (id, currency) => {
  return {
    type: 'CHANGE',
    payload: { id, currency },
  };
};
