import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination, Chip,
} from '@mui/material';
import { getResources } from "../../lib/api.js";
import FaceIcon from '@mui/icons-material/Face';

const itemsPerPage = 5; // 每页显示的项目数

const data = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  value: Math.floor(Math.random() * 100),
})); // 示例数据

export default function ResourcesTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 计算当前页显示的数据
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageItems = data.slice(startIndex, endIndex);

  useEffect(() => {
    getTableData(0, 10);
  }, []);

  const getTableData = async (page, size) => {
    try {
      const res = await getResources(page, size);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }

  const resourcesOption = {

  }

  return (
      <Box sx={{ width: '100%', backgroundColor: 'transparent' }}>
        <Chip icon={<FaceIcon/>} label="Resources Options" onClick={resourcesOption} size="medium" sx={{marginBottom: 2}}/>
        <TableContainer component={Paper} sx={{ width: '100%', backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Table>
            <TableBody sx={{boxShadow: 'none'}}>
              {currentPageItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{border: 'none'}}>
                      <Paper sx={{
                        width: '100%',
                        backgroundColor: 'transparent',
                      }}>
                        {item.name}
                      </Paper>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
  );
};
