import * as React from 'react';
import {
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { ICompanyExpense, IExpense, IUser } from '../dataModel/dataModel';

interface Props {
  title: string;
  headerColumns: string[];
  dataRows: { [id: string]: IUser | IExpense | ICompanyExpense };
  addItemComponent?: React.ReactElement | null;
  onDeleteItem?: (id: string) => void;
  onEditItem?: (id: string) => void;
  isControlNeeded: boolean;
}

export const CustomTable = (props: Props) => {
  const {
    headerColumns,
    dataRows,
    title,
    addItemComponent,
    onDeleteItem,
    onEditItem,
    isControlNeeded,
  } = props;
  const handleDeleteItem = (id: string) => {
    onDeleteItem && onDeleteItem(id);
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <Typography variant="h4">{title}</Typography>
      {addItemComponent}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headerColumns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(dataRows).map(([id, data]) => (
              <TableRow
                key={`${id}_${Math.random}`}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {Object.values(data).map((value) => (
                  <TableCell key={`${id} ${value}`}>{value}</TableCell>
                ))}
                {isControlNeeded && (
                  <TableCell align="right">
                    <IconButton
                      onClick={() => onEditItem && onEditItem(id)}
                      aria-label="delete"
                      size="large"
                    >
                      <EditOutlined />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteItem(id)}
                      aria-label="delete"
                      size="large"
                    >
                      <DeleteOutlined sx={{ color: 'red' }} />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
