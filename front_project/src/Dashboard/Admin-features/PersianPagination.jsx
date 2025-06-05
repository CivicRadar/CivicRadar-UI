import React from 'react';
import {
  TablePagination,
  useTheme,
} from "@mui/material";

const toPersianDigits = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '';
  return num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
};



export default function PersianPagination(props) {
  const theme = useTheme();
  const { page, count, rowsPerPage, onPageChange, onRowsPerPageChange } = props;

  const labelDisplayed = `${toPersianDigits(page * rowsPerPage + 1)}-${toPersianDigits(
    Math.min(count, (page + 1) * rowsPerPage)
  )} از ${toPersianDigits(count)}`;

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage="تعداد سطر در هر صفحه:"
      labelDisplayedRows={() => labelDisplayed}
      rowsPerPageOptions={[5, 10, 20, 50, 100].map((num) => ({
        value: num,
        label: toPersianDigits(num),
      }))}
      SelectProps={{
        renderValue: (value) => toPersianDigits(value),
        sx: {
          direction: "rtl",
          textAlign: "center",
          fontFamily: "Vazir",
        },
      }}
      sx={{
        direction: 'rtl',
        fontFamily: 'Vazir',
        fontSize: '0.9rem',
        [`& .MuiTablePagination-toolbar`]: {
          justifyContent: "space-between",
        },
      }}
    />
  );
}
