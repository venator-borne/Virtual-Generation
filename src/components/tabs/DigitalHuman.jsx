import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import "cropperjs/dist/cropper.css";
import Box from '@mui/material/Box';
import * as yup from 'yup';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  StepLabel,
  Step,
  StepConnector,
  Fade,
  FormControlLabel,
  Checkbox,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent, DialogActions, TablePagination,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {Skeleton} from "@mui/lab";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import CameraIcon from '@mui/icons-material/Camera';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {useState} from "react";
import {makeStyles, withStyles} from "@mui/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const useColorLibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
});

function ColorLibStepIcon(props) {
  const classes = useColorLibStepIconStyles();
  const {active, completed} = props;

  const icons = {
    1: <CameraIcon/>,
    2: <AccountBoxIcon/>,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorLibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const schema = yup.object().shape({
  topic: yup.object().shape({
    identifier: yup.string().required('A train topic is required')
  }),
  trainingFile: yup.object().shape({
    identifier: yup.string().required('DigitalHuman file is required')
  }),
  access: yup.boolean().required('Access mode is required'),
  model: yup.string().required('Model is required'),
  name: yup.string().required('Name is required')
});

const ColorLibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

function getSteps() {
  return ['Train', 'Inference'];
}

export default function DigitalHuman() {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const steps = getSteps();
  const userSlice = useSelector(state => state.user);

  const [avatarModels, setAvatarModels] = useState([]);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [inferenceData, setInferenceData] = useState([]);
  const [selectedInferenceJobRowId, setSelectedInferenceJobRowId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const [activeStep, setActiveStep] = useState(1);
  const [orderDirection, setOrderDirection] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');

  const sortData = (array) => {
    return array.sort((a, b) => {
      if (orderBy === '') return 0;
      if (a[orderBy] < b[orderBy]) {
        return orderDirection === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return orderDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedInferenceData = sortData([...inferenceData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = async (row, id) => {

  };

  const handleNext = (label) => {
    if (label === "Train") setActiveStep(0);
    else if (label === "Inference") setActiveStep(1);
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleStartTraining = async () => {

  }

  const handleStartInference = async () => {

  }

  return (
    <Grid container spacing={5} direction="column">
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorLibConnector/>}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel onClick={() => handleNext(label)}
                       StepIconComponent={ColorLibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Fade in={!activeStep} timeout={500}>
        <Grid size={12} display={!activeStep ? 'block' : 'none'}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <form onSubmit={handleSubmit(handleStartTraining)}>

                <FormControl fullWidth margin="normal" variant="outlined" size="small">
                  <TextField
                    label="Name"
                    variant="outlined"
                    size="small"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </FormControl>

                <Box display="flex" flexDirection="row" gap={2} >
                  <FormControl fullWidth margin="normal" variant="outlined" size="small">
                    <InputLabel id="training-topic">Select Training Topic</InputLabel>
                    <Select
                      defaultValue=""
                      label="Avatar Model"
                      {...register('avatarModel')}
                    >
                      {avatarModels.map(model =>
                        ((model.account_email === userSlice.email || model.type === "PUBLIC") && (
                          <MenuItem
                            value={model.name}>{`${model.name} (${new Date(model.date).toLocaleString()})`}</MenuItem>))
                      )}
                    </Select>
                    {errors.voiceModel && <FormHelperText error>{errors.voiceModel.message}</FormHelperText>}
                  </FormControl>

                  <FormControl fullWidth margin="normal" variant="outlined" size="small">
                    <InputLabel id="training-file-label">Select Training File</InputLabel>
                    <Select
                      defaultValue=""
                      label="Avatar Model"
                      {...register('avatarModel')}
                    >
                      {avatarModels.map(model =>
                        ((model.account_email === userSlice.email || model.type === "PUBLIC") && (
                          <MenuItem
                            value={model.name}>{`${model.name} (${new Date(model.date).toLocaleString()})`}</MenuItem>))
                      )}
                    </Select>
                    {errors.voiceModel && <FormHelperText error>{errors.voiceModel.message}</FormHelperText>}
                  </FormControl>
                </Box>

                <Box display="flex" flexDirection="row" gap={2} >
                  <FormControl fullWidth margin="normal" variant="outlined" size="small">
                    <InputLabel id="access-level-label">Select Access</InputLabel>
                    <Select
                      defaultValue=""
                      label="Avatar Model"
                      {...register('avatarModel')}
                    >
                      {avatarModels.map(model =>
                        ((model.account_email === userSlice.email || model.type === "PUBLIC") && (
                          <MenuItem
                            value={model.name}>{`${model.name} (${new Date(model.date).toLocaleString()})`}</MenuItem>))
                      )}
                    </Select>
                    {errors.voiceModel && <FormHelperText error>{errors.voiceModel.message}</FormHelperText>}
                  </FormControl>

                  <FormControl fullWidth margin="normal" variant="outlined" size="small">
                    <InputLabel>Model</InputLabel>
                    <Select
                      defaultValue=""
                      label="Avatar Model"
                      {...register('avatarModel')}
                    >
                      {avatarModels.map(model =>
                        ((model.account_email === userSlice.email || model.type === "PUBLIC") && (
                          <MenuItem
                            value={model.name}>{`${model.name} (${new Date(model.date).toLocaleString()})`}</MenuItem>))
                      )}
                    </Select>
                    {errors.voiceModel && <FormHelperText error>{errors.voiceModel.message}</FormHelperText>}
                  </FormControl>
                </Box>

                <Box display="flex" flexDirection="row" gap={2} >
                  <Button variant="outlined" sx={{mt: 2}}>Preprocess</Button>
                  <Button type="submit" variant="contained" sx={{mt: 2}}>Start</Button>
                </Box>
              </form>

              <Card sx={{marginTop: '10px'}}>
                <CardContent>
                  <b>Preview</b>
                  <video controls style={{width: '100%'}} preload="metadata">
                    Your browser does not support the video element.
                  </video>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={6}>
              <Box mt={2} p={2}>
                <b>Training Status</b>
                <Skeleton animation={false} height={30}/>
              </Box>
              <Box mt={2} p={2}>
                <b>Training Logs</b>
                <TextField
                  fullWidth
                  placeholder="Logs..."
                  disabled={true}
                  multiline
                  rows={5}
                  sx={{mt: 2}}
                  {...register('formInputText')}
                  error={!!errors.formInputText}
                  helperText={errors.formInputText?.message}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Fade>
      <Fade in={activeStep} timeout={500}>
        <Grid size={12} display={activeStep ? 'block' : 'none'}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <form onSubmit={handleSubmit(handleStartInference)}>
                <FormControl fullWidth margin="normal" variant="outlined" size="small">
                  <TextField
                    label="Name"
                    variant="outlined"
                    size="small"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </FormControl>

                <Box display="flex" alignItems="center" gap={2} sx={{mt: 2}}>

                  <FormControl variant="outlined" style={{flex: 1}} size="small" error={!!errors.voiceModel}>
                    <InputLabel>Avatar Model</InputLabel>
                    <Select
                      defaultValue=""
                      label="Avatar Model"
                      {...register('avatarModel')}
                    >
                      {avatarModels.map(model =>
                        ((model.account_email === userSlice.email || model.type === "PUBLIC") && (
                          <MenuItem
                            value={model.name}>{`${model.name} (${new Date(model.date).toLocaleString()})`}</MenuItem>))
                      )}
                    </Select>
                    {errors.voiceModel && <FormHelperText error>{errors.voiceModel.message}</FormHelperText>}
                  </FormControl>
                </Box>

                <Box display="flex" gap={2} sx={{mt: 2}}>
                  <TextField
                    fullWidth
                    placeholder="Enter text here"
                    multiline
                    rows={5}
                    sx={{mt: 2}}
                    {...register('formInputText')}
                    error={!!errors.formInputText}
                    helperText={errors.formInputText?.message}
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={2} sx={{mt: 2}}>
                  <Button variant="contained" type="submit">Submit</Button>
                  <FormControlLabel control={
                    <Checkbox checked={showSubtitle}
                              onChange={(e) => setShowSubtitle(e.target.checked)}
                    />} label="Subtitle"/>
                </Box>
              </form>
              <Card sx={{marginTop: '10px'}}>
                <CardContent>
                  <b>Preview</b>
                  <video controls style={{width: '100%'}} preload="metadata">
                    Your browser does not support the video element.
                  </video>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={6}>
              <b>My Inference</b>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{backgroundColor: '#f5f5f5'}}>
                      {[
                        {id: 'name', label: 'Inference Name'},
                        {id: 'date', label: 'Submission Time'},
                        {id: 'ttsModelName', label: 'Voice Model'},
                        {id: 'faceModelName', label: 'Face Model'},
                        {id: 'status', label: 'Status'},
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
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {sortedInferenceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}
                                onClick={() => handleRowClick(row, index)}
                                style={{
                                  cursor: 'pointer',
                                  backgroundColor: index === selectedInferenceJobRowId ? '#e0e0e0' : 'inherit',
                                }}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{new Date(row.date).toLocaleString()}</TableCell>
                        <TableCell>{row.ttsModelName}</TableCell>
                        <TableCell>{row.faceModelName}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>
                          {/*<IconButton*/}
                          {/*  onClick={(e) => {*/}
                          {/*    e.stopPropagation();*/}
                          {/*    handleMenuOpen(e, index);*/}
                          {/*  }}*/}
                          {/*  sx={{padding: '4px'}}*/}
                          {/*>*/}
                          {/*  <MoreVertIcon/>*/}
                          {/*</IconButton>*/}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[3, 5, 10]}
                component="div"
                count={inferenceData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
          </Grid>
        </Grid>
      </Fade>
    </Grid>
  )
}
