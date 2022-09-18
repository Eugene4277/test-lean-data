import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from '@mui/material';
import { EditActionType, EventType, IExpense, IUser } from '../dataModel/dataModel';

export interface ExpenseData {
  user: IUser;
  category: string;
  description: string;
  cost: string;
  id?: string;
}

interface Props {
  onAction: (
    data: ExpenseData,
    action: EventType,
    previousCategory?: {
      name: string;
      id: string;
    }
  ) => void;
  selectedItem: Partial<IExpense>;
  submitLabel: string;
  users: { [id: string]: IUser };
}

const categories = ['Food', 'Travel', 'Equipment'];

export const ExpensesForm = (props: Props) => {
  const { selectedItem, submitLabel, users } = props;
  const intitialExpenseData = {
    user: selectedItem.user || ({} as IUser),
    category: selectedItem.category?.name || categories[0],
    description: selectedItem.description || '',
    cost: selectedItem.cost || '',
  };

  const [expenseData, setExpenseData] = useState(intitialExpenseData);
  useEffect(() => {
    setExpenseData(intitialExpenseData);
  }, [selectedItem]);

  const handleExpenseDataChange = (
    e: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //@ts-ignore
    const id = e.target.id;
    //@ts-ignore
    const value = e.target.value;

    setExpenseData((prevState) => {
      if (id === 'cost') {
        return { ...prevState, [id]: value.replace(/\D/g, '') };
      }
      return { ...prevState, [id]: value };
    });
  };
  const handleSelectExpenseDataChange = (e: SelectChangeEvent<string>, id: string) => {
    setExpenseData((prevState) => {
      if (id === 'fullName') {
        return { ...prevState, user: { id: e.target.value, ...users[e.target.value] } };
      }
      return { ...prevState, [id]: e.target.value };
    });
  };

  console.log('========111============================');
  console.log(selectedItem.category!);
  console.log('========111============================');

  const handleAction = (event: EditActionType) => {
    if (isUpdate) {
      if (event === EditActionType.Cancel) {
        props.onAction({} as ExpenseData, EventType.Cancel);
      } else {
        props.onAction(
          { id: selectedItem.id!, ...expenseData },
          EventType.Update,
          selectedItem.category!
        );
      }
    } else {
      props.onAction(expenseData, EventType.Create);
    }
    setExpenseData({
      user: {} as IUser,
      category: categories[0],
      description: '',
      cost: '',
    });
  };
  const isUpdate = Object.keys(selectedItem).length;

  const isDisabled =
    !Object.keys(expenseData.user).length ||
    !expenseData.category ||
    !expenseData.description ||
    !expenseData.cost;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px' }}>
      <InputLabel id="fullName">Full Name</InputLabel>
      <Select
        labelId="fullName"
        autoWidth
        id="fullName"
        value={expenseData.user.id || ''}
        label="Full Name"
        onChange={(e) => handleSelectExpenseDataChange(e, 'fullName')}
      >
        {Object.entries(users).map(([id, user]) => (
          <MenuItem key={id} value={id}>
            {user.firstName} {user.lastName}
          </MenuItem>
        ))}
      </Select>
      <InputLabel id="category">Category</InputLabel>
      <Select
        labelId="category"
        autoWidth
        id="category"
        value={expenseData.category}
        label="Category"
        onChange={(e) => handleSelectExpenseDataChange(e, 'category')}
      >
        {categories.map((category, i) => (
          <MenuItem key={`${category}_${i}`} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
      <TextField
        //@ts-ignore
        onChange={handleExpenseDataChange}
        value={expenseData.description}
        label="Description"
        id="description"
        variant="outlined"
      />
      <TextField
        //@ts-ignore
        onChange={handleExpenseDataChange}
        value={expenseData.cost}
        label="Cost"
        id="cost"
        variant="outlined"
      />
      <Button
        disabled={isDisabled}
        variant="contained"
        size="large"
        onClick={() => handleAction(EditActionType.Action)}
      >
        {submitLabel}
      </Button>
      {!!isUpdate && (
        <Button
          color="secondary"
          variant="contained"
          size="large"
          onClick={() => handleAction(EditActionType.Cancel)}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};
