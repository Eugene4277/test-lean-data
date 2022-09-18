import { ICompanyExpense, IExpense, IUser } from '../dataModel/dataModel';

export const transformExpenses = (expenses: { [id: string]: IExpense }) => {
  return Object.entries(expenses).reduce((result, [id, data]) => {
    const { user, category, description, cost } = data;
    return {
      ...result,
      [id]: {
        fullName: `${user.firstName} ${user.lastName}`,
        category: category.name,
        description,
        cost,
      },
    };
  }, {});
};
export const transformUsers = (users: { [id: string]: IUser }) => {
  return Object.entries(users).reduce((result, [id, data]) => {
    const { expenses, ...rest } = data;
    return {
      ...result,
      [id]: {
        ...rest,
        expenses: expenses.map((expense) => `${expense.name} `),
      },
    };
  }, {});
};
export const transformCompanyExpenses = (companyExpenses: {
  [id: string]: ICompanyExpense;
}) => {
  return Object.entries(companyExpenses).reduce((result, [id, data]) => {
    const { cost, category } = data;
    return {
      ...result,
      [id]: {
        category: category.name,
        cost,
      },
    };
  }, {});
};
