import { v4 as uuidv4 } from 'uuid';

class User {
  id: string;
  firstName: string;
  lastName: string;
  expenses: { name: string; id: string }[];
  constructor(firstName: string, lastName: string) {
    this.id = uuidv4();
    this.firstName = firstName;
    this.lastName = lastName;
    this.expenses = [];
  }
  getUser() {
    return {
      [this.id]: {
        firstName: this.firstName,
        lastName: this.lastName,
        expenses: this.expenses,
      },
    };
  }
}

class Expense {
  id: string;
  category: string;
  description: string;
  cost: string;
  user: IUser;
  constructor(user: IUser, category: string, description: string, cost: string) {
    this.id = uuidv4();
    this.user = user;
    this.category = category;
    this.description = description;
    this.cost = cost;
  }
  getExpense() {
    return {
      [this.id]: {
        user: this.user,
        category: { id: this.id, name: this.category },
        description: this.description,
        cost: this.cost,
      },
    };
  }
}

interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  expenses: { name: string; id: string }[];
}
interface IExpense {
  id?: string;
  user: IUser;
  category: { name: string; id: string };
  description: string;
  cost: string;
}
interface ICompanyExpense {
  category: { name: string; id: string };
  cost: number;
}

enum EventType {
  Create = 'Create',
  Update = 'Update',
  Cancel = 'Cancel',
}
enum EditActionType {
  Action = 'Create',
  Cancel = 'Cancel',
}

export { User, Expense, EventType, EditActionType };
export type { IUser, IExpense, ICompanyExpense };
