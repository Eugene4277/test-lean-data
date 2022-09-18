import { useState } from 'react';
import { UsersForm, UserData } from './components/UsersForm';
import { ExpensesForm, ExpenseData } from './components/ExpensesForm';
import { CustomTable } from './components/CustomTable';
import {
  IUser,
  User,
  IExpense,
  Expense,
  EventType,
  ICompanyExpense,
} from './dataModel/dataModel';
import {
  transformCompanyExpenses,
  transformExpenses,
  transformUsers,
} from './utils/transformers';

function App() {
  const [state, setState] = useState<{
    users: { [id: string]: IUser };
    expenses: { [id: string]: IExpense };
    companyExpenses: {
      [id: string]: ICompanyExpense;
    };
  }>({ users: {}, expenses: {}, companyExpenses: {} });
  const [selectedUser, setSelectedUser] = useState<Partial<IUser & { id: string }>>({});
  const [selectedExpense, setSelectedExpense] = useState<
    Partial<IExpense & { id: string }>
  >({});

  const handleUserEdit = (id: string) => {
    setSelectedUser({ id, ...state.users[id] });
  };
  const handleExpenseEdit = (id: string) => {
    setSelectedExpense({ id, ...state.expenses[id] });
  };

  const handleUsersAction = (data: UserData, action: string) => {
    if (action === EventType.Create) {
      const newUser = new User(data.firstName, data.lastName).getUser();
      setState((prev) => ({ ...prev, users: { ...prev.users, ...newUser } }));
    } else if (action === EventType.Update) {
      setState((prev) => {
        const { users, expenses } = prev;

        users[data.id!] = {
          ...users[data.id!],
          firstName: data.firstName,
          lastName: data.lastName,
        };

        const results = Object.entries(expenses).filter(
          ([id, expence]) => expence.user.id === data.id
        );
        const newExpenses = results.reduce((result, [id, expense]) => {
          return {
            ...result,
            [id]: {
              ...expense,
              user: {
                ...expense.user,
                firstName: data.firstName,
                lastName: data.lastName,
              },
            },
          };
        }, {});

        return {
          ...prev,
          users: { ...users },
          expenses: { ...expenses, ...newExpenses },
        };
      });

      setSelectedUser({});
    } else {
      setSelectedUser({});
    }
  };
  const handleExpenseAction = (
    data: ExpenseData,
    action: string,
    previousCategory?: {
      name: string;
      id: string;
    }
  ) => {
    if (action === EventType.Create) {
      const newExpense = new Expense(
        data.user,
        data.category,
        data.description,
        data.cost
      ).getExpense();

      setState((prev) => {
        const { users, companyExpenses, expenses } = prev;
        const newEx = Object.entries(newExpense).map(([id, newEx]) => newEx.category)[0];

        users[data.user.id!].expenses.push(newEx);
        const newCompanyExpenses = {
          ...companyExpenses,
          [data.category]: {
            category: newEx,
            cost: (Number(companyExpenses[data.category]?.cost) || 0) + Number(data.cost),
          },
        };
        return {
          ...prev,
          users: { ...users },
          companyExpenses: { ...newCompanyExpenses },
          expenses: { ...expenses, ...newExpense },
        };
      });
    } else if (action === EventType.Update) {
      setState((prev) => {
        const { expenses, users, companyExpenses } = prev;
        let updatedUser = users[data.user.id!];
        const oldExpenses = updatedUser.expenses.filter(
          (expense) => expense.id !== data.id!
        );
        const newExpense = updatedUser.expenses.find(
          (expense) => expense.id === data.id!
        );
        newExpense!.name = data.category;
        updatedUser = { ...updatedUser, expenses: [...oldExpenses, newExpense!] };

        const isSameCategory = previousCategory?.name === data.category;

        const cost = isSameCategory
          ? Number(companyExpenses[previousCategory?.name]?.cost || 0) + Number(data.cost)
          : Number(companyExpenses[previousCategory?.name!]?.cost || 0) -
            Number(data.cost);

        const newValue = isSameCategory
          ? {
              [previousCategory!.name]: {
                category: previousCategory!,
                cost,
              },
            }
          : {
              [previousCategory!.name]: {
                category: previousCategory!,
                cost,
              },
              [data.category]: {
                category: { id: data.id!, name: data.category },
                cost:
                  Number(companyExpenses[data.category]?.cost || 0) + Number(data.cost),
              },
            };
        const newCompanyExpenses = {
          ...companyExpenses,
          ...newValue,
        };

        expenses[data.id!] = {
          ...expenses[data.id!],
          user: data.user,
          category: { id: data.id!, name: data.category },
          description: data.description,
          cost: data.cost,
        };

        return {
          ...prev,
          expenses: { ...expenses },
          users: { ...users },
          companyExpenses: { ...newCompanyExpenses },
        };
      });

      setSelectedExpense({});
    } else {
      setSelectedExpense({});
    }
  };

  const handleUserDelete = (id: string) => {
    setState((prev) => {
      const { expenses, companyExpenses, users } = prev;

      const expensesResults = Object.entries(expenses).filter(([i, expense]) => {
        return expense.user.id === id;
      });

      expensesResults.forEach(([id, item]) => {
        if (companyExpenses[item.category.name].cost - Number(item.cost) === 0) {
          delete companyExpenses[item.category.name];
        } else {
          companyExpenses[item.category.name].cost -= Number(item.cost);
        }
        delete expenses[id];
      });

      delete users[id];

      return {
        ...prev,
        users: { ...users },
        companyExpenses: { ...companyExpenses },
        expenses: { ...expenses },
      };
    });
  };

  const handleExpenseDelete = (id: string) => {
    setState((prev) => {
      const { companyExpenses, expenses, users } = prev;

      const expenseToDelete = expenses[id];

      if (
        companyExpenses[expenseToDelete.category.name].cost -
          Number(expenseToDelete.cost) ===
        0
      ) {
        delete companyExpenses[expenseToDelete.category.name];
      } else {
        companyExpenses[expenseToDelete.category.name].cost -= Number(
          expenseToDelete.cost
        );
      }

      users[expenseToDelete.user.id!].expenses = users[
        expenseToDelete.user.id!
      ].expenses.filter((expense) => expense.id !== id);

      delete expenses[id];

      return {
        ...prev,
        companyExpenses: { ...companyExpenses },
        users: { ...users },
        expenses: { ...expenses },
      };
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <CustomTable
        title="Users Table"
        headerColumns={['First Name', 'Last Name', 'Total Expenses']}
        dataRows={transformUsers(state.users)}
        addItemComponent={
          <UsersForm
            onAction={handleUsersAction}
            submitLabel={Object.keys(selectedUser).length ? 'Edit User' : 'Add User'}
            selectedItem={selectedUser}
          />
        }
        onDeleteItem={(id) => handleUserDelete(id)}
        onEditItem={handleUserEdit}
        isControlNeeded
      />
      <CustomTable
        title="Expense Table"
        headerColumns={['Full Name', 'Category', 'Description', 'Cost']}
        dataRows={transformExpenses(state.expenses)}
        addItemComponent={
          <ExpensesForm
            onAction={handleExpenseAction}
            submitLabel={
              Object.keys(selectedExpense).length ? 'Edit Expense' : 'Add Expense'
            }
            selectedItem={selectedExpense}
            users={state.users}
          />
        }
        onDeleteItem={handleExpenseDelete}
        onEditItem={handleExpenseEdit}
        isControlNeeded
      />
      <CustomTable
        title="Company Expense Table"
        headerColumns={['Category', 'Total $']}
        dataRows={transformCompanyExpenses(state.companyExpenses)}
        isControlNeeded={false}
      />
    </div>
  );
}

export default App;
