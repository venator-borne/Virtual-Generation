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
  TablePagination, Chip, Typography, Popover, Button, Fade, Checkbox, FormControlLabel,
} from '@mui/material';
import {getResources, getResourcesCount} from "../../lib/api.js";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CollectionsIcon from '@mui/icons-material/Collections';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';

export default function ResourcesTable() {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [types, setTypes] = useState(['VIDEO', 'AUDIO', 'PICS']);
  const [categories, setCategories] = useState(['FIGURE', 'SCENE','PAINTING']);

  const [options, setOptions] = useState(null);

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
    getTableData(page, itemsPerPage, types, categories);
  }, [page, itemsPerPage]);

  useEffect(() => {
    getTableCount(page, itemsPerPage, types, categories);
  }, [])

  const getTableData = async (p, s, t, c) => {
    try {
      let data = {
        page: p,
        size: s,
        types: t,
        categories: c,
      }
      const res = await getResources(data);
      console.log(res);
      setData(res);
    } catch (e) {
      console.log(e);
    }
  }

  const getTableCount = async (p, s, t, c) => {
    try {
      let data = {
        page: p,
        size: s,
        types: t,
        categories: c,
      }
      const res = await getResourcesCount(data);
      console.log(res);
      setCount(res);
    } catch (e) {
      console.log(e);
    }
  }

  const optionsClick = () => {
    if (options) {
      console.log(types);
      console.log(categories);
      console.log(categories.includes('PAINTING'))
    }
    setOptions((prev) => !prev);
  }

  const handleTypeChange = (event) => {
    const value = event.target.name;
    setTypes((prev) =>
        prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  const handleCategoryChange = (event) => {
    const value = event.target.name;
    setCategories((prev) =>
        prev.includes(value) ? prev.filter((category) => category !== value) : [...prev, value]
    );
  };

  return (
      <Box sx={{ width: '100%', backgroundColor: 'transparent' }}>
        <Chip icon={<AccountTreeIcon/>} label={options ? "Confirm" : "Resources Options"} size="medium" onClick={optionsClick} sx={{marginBottom: 2}}/>
        {options && (
            <Fade in={options} timeout={400}>
              <Paper
                  sx={{
                    padding: 2,
                    backgroundColor: 'transparent',
                    boxShadow: 1,
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
              >
                <Typography variant="h6">Options</Typography>
                <Box>
                  <Chip icon={<CollectionsIcon />} label="TYPE" size="medium" sx={{ marginRight: 1 }} />
                  {['VIDEO', 'AUDIO', 'PICS'].map((type) => (
                      <FormControlLabel
                          key={type}
                          control={
                            <Checkbox
                                checked={types.includes(type)}
                                onChange={handleTypeChange}
                                name={type}
                            />
                          }
                          label={type}
                      />
                  ))}
                </Box>
                <Box>
                  <Chip icon={<FilterFramesIcon />} label="CATEGORY" size="medium" sx={{ marginRight: 1 }} />
                  {['FIGURE', 'SCENE', 'PAINTING'].map((category) => (
                      <FormControlLabel
                          key={category}
                          control={
                            <Checkbox
                                checked={categories.includes(category)}
                                onChange={handleCategoryChange}
                                name={category}
                            />
                          }
                          label={category}
                      />
                  ))}
                </Box>
              </Paper>
            </Fade>
        )}
        <TableContainer component={Paper} sx={{ width: '100%', backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Table>
            <TableBody sx={{boxShadow: 'none'}}>
              {currentPageItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{border: 'none', paddingLeft: 0}}>
                      <Paper sx={{
                        width: '100%',
                        backgroundColor: 'transparent',
                      }}>
                        <Box sx={{padding: 2}}>
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>
                              {item.name}&nbsp;&nbsp;&nbsp;
                              <Chip color={item.access ? "success" : "primary"} label={item.access ? "PUBLIC" : "PRIVATE"}></Chip>
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="button" gutterBottom>
                              {item.type}
                            </Typography>
                            &nbsp;&nbsp;&nbsp;
                            <Typography variant="caption" gutterBottom>
                              {new Date(item.createTime).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
  );
};
