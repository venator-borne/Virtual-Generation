import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  TextField,
  Select,
  Menu,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const modelTypes = ['Face', 'TTS'];

const ModelsTab = () => {
  const schema = yup.object().shape({
    newName: yup.string().required('name is required'),
  });
  const { models, updateModels } = useModels();
  const CONFIRM_BUTTON_COLOR = '#1976d2';
  const {register, handleSubmit, formState: { errors }} = useForm({ resolver: yupResolver(schema) });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderDirection, setOrderDirection] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [currentUserInfo, setCurrentUserInfo] = useState({name: '', email: ''});

  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedRow, setSelectedRow] = useState(0);

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isChangeAccessDialogOpen, setIsChangeAccessDialogOpen] = useState(false);
  const [newAccess, setNewAccess] = useState('');

  const [modelName, setModelName] = useState('');
  const [modelType, setModelType] = useState('');
  const [modelFile, setModelFile] = useState(null);

  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (array) => {
    return array
        .sort((a, b) => {
          if (orderBy === '') return 0;
          if (a[orderBy] < b[orderBy]) {
            return orderDirection === 'asc' ? -1 : 1;
          }
          if (a[orderBy] > b[orderBy]) {
            return orderDirection === 'asc' ? 1 : -1;
          }
          return 0;
        })
        .filter(record => record.status === 'COMPLETE' || record.status === 'FAIL');
  };

  const handleLogs = async () => {

  };

  const handleChangePage = (event, newPage) => {
  };

  const handleChangeRowsPerPage = (event) => {
  };

  const handleFileChange = (event) => {
  };

  const handleUploadSubmit = (event) => {

  };

  const handleMenuOpen = (event, index) => {
  };

  const handleMenuClose = () => {
  };

  const handleDownload = () =>{
  }

  const handleDelete = () => {
  };

  const handleRename = () => {
  };

  const handleRenameDialogClose = () => {
  };

  const handleRenameSubmit = async () => {

  };

  const handleConfirmDelete = async () => {
  };

  const handleCancelDelete = () => {
  };

  const handleChangeAccess = () => {
  };

  const handleChangeAccessClose = () => {
  }

  const handleChangeAccessSubmit = async () => {

  }

  const sortedData = sortData([...models]);

  return (
      <>
        <b>Add Model</b>
        <Paper sx={{ width: '100%', padding: '20px', mb:1}}>
          <form onSubmit={handleUploadSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                    label="Model Name"
                    variant="outlined"
                    fullWidth
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    size='small'
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel id="model-type-label">Model Type</InputLabel>
                  <Select
                      labelId="model-type-label"
                      value={modelType}
                      onChange={(e) => setModelType(e.target.value)}
                      label="Model Type"
                      size='small'
                  >
                    {modelTypes.map((type, index) => (
                        <MenuItem value={type} key={index}>
                          {type}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<UploadFileIcon />}
                    sx={{ height: '40px' }}
                >
                  {modelFile ? modelFile.name : 'Upload Model'}
                  <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      id="model-file-input"
                  />
                </Button>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button variant="contained" color="primary" type="submit"
                        fullWidth
                        sx={{ height: '40px' }}
                >
                  Submit Model
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <b>Model List</b>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                {[
                  { id: 'name', label: 'Model Name' },
                  { id: 'date', label: 'Created Time' },
                  { id: 'model', label: 'Model Type' },
                  { id: 'type', label: 'Access Level' },
                  { id: 'status', label: 'Status' },
                  { id: 'account_username', label: 'Owner' },
                ].map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? orderDirection : false}
                    >
                      <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? orderDirection : 'asc'}
                          onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.account_username}</TableCell>
                    <TableCell>
                      <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, index);
                          }}
                          sx={{padding: '4px'}}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>

          <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
          >
            {/*{*/}
            {/*    (sortedData[selectedRow + page * rowsPerPage]?.type !== 'PUBLIC' ||*/}
            {/*        (sortedData[selectedRow + page * rowsPerPage]?.type === 'PUBLIC' &&*/}
            {/*            sortedData[selectedRow + page * rowsPerPage]?.account_email === currentUserInfo.email)) && (*/}
            {/*        <>*/}
            {/*          <MenuItem onClick={handleRename}>Rename model</MenuItem>*/}
            {/*          <MenuItem onClick={handleDelete}>Delete model</MenuItem>*/}
            {/*          <MenuItem onClick={handleLogs}>Logs</MenuItem>*/}
            {/*        </>*/}
            {/*    )*/}
            {/*}*/}
            <MenuItem onClick={handleDownload}>Download model</MenuItem>
            <MenuItem onClick={handleChangeAccess}>Change Access</MenuItem>
          </Menu>

          {/*<Dialog open={isRenameDialogOpen} onClose={handleRenameDialogClose} closeAfterTransition={false}>*/}
          {/*  <DialogTitle>Rename File</DialogTitle>*/}
          {/*  <DialogContent>*/}
          {/*    <TextField*/}
          {/*        label="New Model Name"*/}
          {/*        sx={{mt: 2}}*/}
          {/*        fullWidth*/}
          {/*        value={newName}*/}
          {/*        error={!!errors.newName}*/}
          {/*        helperText={errors.newName?.message}*/}
          {/*        {...register('newName')}*/}
          {/*        onChange={(e) => setNewName(e.target.value)}*/}
          {/*    />*/}
          {/*  </DialogContent>*/}
          {/*  <DialogActions>*/}
          {/*    <Button onClick={handleRenameDialogClose}>Cancel</Button>*/}
          {/*    <Button onClick={handleSubmit(handleRenameSubmit)} variant="contained" color="primary">*/}
          {/*      Save*/}
          {/*    </Button>*/}
          {/*  </DialogActions>*/}
          {/*</Dialog>*/}
          {/*<Dialog open={isDeleteDialogOpen} onClose={handleCancelDelete} closeAfterTransition={false}>*/}
          {/*  <DialogTitle>Confirm Deletion</DialogTitle>*/}
          {/*  <DialogContent>*/}
          {/*    Are you sure you want to delete this model?*/}
          {/*  </DialogContent>*/}
          {/*  <DialogActions>*/}
          {/*    <Button onClick={handleCancelDelete} variant="contained">Cancel</Button>*/}
          {/*    <Button onClick={handleConfirmDelete} variant="outlined" color="error">*/}
          {/*      Delete*/}
          {/*    </Button>*/}
          {/*  </DialogActions>*/}
          {/*</Dialog>*/}
          {/*<Dialog open={isChangeAccessDialogOpen} onClose={handleChangeAccessClose} closeAfterTransition={false}>*/}
          {/*  <DialogTitle>Change Access Type</DialogTitle>*/}
          {/*  <DialogContent>*/}
          {/*    <Select defaultValue="" value={newAccess}*/}
          {/*            onChange={(e) => setNewAccess(e.target.value)}>*/}
          {/*      <MenuItem value="PUBLIC">PUBLIC</MenuItem>*/}
          {/*      <MenuItem value="PRIVATE">PRIVATE</MenuItem>*/}
          {/*    </Select>*/}
          {/*  </DialogContent>*/}
          {/*  <DialogActions>*/}
          {/*    <Button onClick={handleChangeAccessClose}>Cancel</Button>*/}
          {/*    <Button onClick={handleChangeAccessSubmit} variant="contained" color="primary">*/}
          {/*      Save*/}
          {/*    </Button>*/}
          {/*  </DialogActions>*/}
          {/*</Dialog>*/}

          {/*<Dialog open={isLogsDialogOpen}*/}
          {/*        onClose={() => setIsLogsDialogOpen(false)}*/}
          {/*        maxWidth="md"*/}
          {/*        fullWidth*/}
          {/*        PaperProps={{*/}
          {/*          style: {*/}
          {/*            width: '70%',*/}
          {/*            height: '60%',*/}
          {/*            maxWidth: 'none',*/}
          {/*            maxHeight: 'none',*/}
          {/*            display: 'flex',*/}
          {/*            flexDirection: 'column',*/}
          {/*            justifyContent: 'center',*/}
          {/*            alignItems: 'center',*/}
          {/*            overflowY: 'auto',*/}
          {/*          },*/}
          {/*        }}>*/}
          {/*  <DialogTitle>Logs</DialogTitle>*/}
          {/*  <DialogContent style={{padding: '20px', width: '100%', boxSizing: 'border-box'}}>*/}
          {/*    <pre style={{*/}
          {/*      whiteSpace: 'pre-wrap',*/}
          {/*      wordBreak: 'break-word',*/}
          {/*      textAlign: 'left',*/}
          {/*      width: '100%',*/}
          {/*      margin: '10px 0',*/}
          {/*      overflowX: 'hidden',*/}
          {/*    }}>*/}
          {/*      {logs.join('')}*/}
          {/*    </pre>*/}
          {/*  </DialogContent>*/}
          {/*  <DialogActions>*/}
          {/*    <Button onClick={() => setIsLogsDialogOpen(false)} variant="contained">Close</Button>*/}
          {/*  </DialogActions>*/}
          {/*</Dialog>*/}

        </TableContainer>
        {/*<TablePagination*/}
        {/*    rowsPerPageOptions={[5, 10, 25]}*/}
        {/*    component="div"*/}
        {/*    count={sortedData.length}*/}
        {/*    rowsPerPage={rowsPerPage}*/}
        {/*    page={page}*/}
        {/*    onPageChange={handleChangePage}*/}
        {/*    onRowsPerPageChange={handleChangeRowsPerPage}*/}
        {/*/>*/}
        <Divider />

      </>
  );
};

export default ModelsTab;
