import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { IUser, EventType, EditActionType } from '../dataModel/dataModel';

export interface UserData {
  firstName: string;
  lastName: string;
  id?: string;
}

interface Props {
  onAction: (data: UserData, action: 'Create' | 'Update' | 'Cancel') => void;
  selectedItem: Partial<IUser>;
  submitLabel: string;
}

export const UsersForm = (props: Props) => {
  const { selectedItem, submitLabel } = props;
  const intitialUserData = {
    firstName: selectedItem.firstName || '',
    lastName: selectedItem.lastName || '',
  };

  const [userData, setUserData] = useState(intitialUserData);
  useEffect(() => {
    setUserData(intitialUserData);
  }, [selectedItem]);

  const handleUserDataChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    //@ts-ignore
    setUserData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }));
  };
  const isUpdate = Object.keys(selectedItem).length;
  const handleAction = (event: EditActionType) => {
    if (isUpdate) {
      if (event === EditActionType.Cancel) {
        props.onAction({} as UserData, EventType.Cancel);
      } else {
        props.onAction({ id: selectedItem.id!, ...userData }, EventType.Update);
      }
    } else {
      props.onAction(userData, EventType.Create);
    }
    setUserData({ firstName: '', lastName: '' });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px' }}>
      <TextField
        onChange={handleUserDataChange}
        value={userData.firstName}
        label="First Name"
        id="firstName"
        variant="outlined"
      />
      <TextField
        onChange={handleUserDataChange}
        value={userData.lastName}
        label="Last Name"
        id="lastName"
        variant="outlined"
      />
      <Button
        disabled={!userData.firstName || !userData.lastName}
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
