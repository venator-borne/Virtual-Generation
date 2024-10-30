import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import StorageIcon from '@mui/icons-material/Storage';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@mui/material/Drawer';
import Training from './Training';
import Inference from './Inference';
import Tools from './Tools';
import Models from './Models';
import Resources from './Resources';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton,
  InputAdornment, LinearProgress,
  SvgIcon,
  TextField,
  Typography
} from '@mui/material';
import { check, logout, merge, upload } from '../../lib/api.js';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ListIcon from '@mui/icons-material/List';
import { useSelector } from "react-redux";
import SparkMD5 from "spark-md5";
import CustomCircularProgress from "../parts/CustomCircularProgress.jsx";
import CustomLinearProgress from "../parts/CustomLinearProgress.jsx";
import ResourcesTable from "../parts/ResourcesTable.jsx";

const AntTab = styled((props) => <Tab disableRipple {...props} />)(({theme}) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(0),
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#1890ff',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}));

export default function BasicTabs() {
  const userSlice = useSelector(state => state.user);

  const [value, setValue] = useState('1');
  const [user, setUser] = useState({username: '', email: ''});

  const [open, setOpen] = useState(false); //drawer
  const [resources, setResources] = useState(false);
  const [loading, setLoading] = useState(null);
  const [file, setFile] = useState(null);
  const [slice, setSlice] = useState([]);
  const [md5, setMd5] = useState(null);
  const [uploadingDialog, setUploadingDialog] = useState(false);
  const [confirmUpload, setConfirmUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadRate, setUploadRate] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const resourcesRef = useRef(null);

  const CHUNK_SIZE = 5 * 1024 * 1024;

  const resourcesButtonClick = () => {
    resourcesRef.current.click();
  }

  const handleFileChange = async (event) => {
    setUploadingDialog(false);
    setLoading(true);
    setMd5(null);
    setSlice([]);
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    await computeMD5(event.target.files[0]);
  }

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleResourcesDrawer = (newOpen) => () => {
    setResources(newOpen);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem('tab-index', newValue);
    const openSelects = document.getElementsByClassName('MuiBackdrop-root');
    for (let openSelect of openSelects) {
      openSelect.click();
    }
  };

  useEffect(() => {
    setUser({username: userSlice.username, email: userSlice.email});
    const initialTabIndex = localStorage.getItem('tab-index') || '1';
    setValue(initialTabIndex);
  }, [])

  const handleLogout = async () => {
    console.log('logging out...');
    let status = await logout();
    console.log(status);
  }

  const truncate = (input) => {
    if (input && input.length > 20) {
      return input.substring(0, 20) + '...';
    }
    return input;
  };

  const computeMD5 = async (f) => {
    if (!f) return;
    let currentChunk = 0;
    let chunks = Math.ceil(f.size / CHUNK_SIZE);
    let spark = new SparkMD5.ArrayBuffer();
    let sliceSpark = new SparkMD5.ArrayBuffer();
    let sliceMd5 = [];

    const readChunk = (blob) => {
      return new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          resolve(e.target.result);
        };
        fileReader.onerror = () => {
          console.warn("cannot read file", f.name);
          reject();
        };
        fileReader.readAsArrayBuffer(blob);
      });
    };
    while (currentChunk < chunks) {
      let start = currentChunk * CHUNK_SIZE;
      let end = start + CHUNK_SIZE >= f.size ? f.size : start + CHUNK_SIZE;
      const blob = f.slice(start, end);
      try {
        const d = await readChunk(blob);
        spark.append(d);
        sliceSpark.append(d);
        sliceMd5.push(sliceSpark.end());
        currentChunk = currentChunk + 1;
      } catch (e) {
        console.log(e);
        return;
      }
    }
    const identifier = spark.end();
    const chunkIdentifiers = sliceMd5;
    console.log(identifier);
    console.log(chunkIdentifiers);
    setSlice(chunkIdentifiers);
    setMd5(identifier);
    setUploadingDialog(true);
  }

  const cancelUpload = () => {
    setFile(null);
    setLoading(null);
    setMd5(null);
    setSlice([]);
    setUploadingDialog(false);
    setConfirmUpload(false)
    setUploading(false);
  }

  const startUpload = async () => {
    setConfirmUpload(true);
    setUploading(true);
    const checkRes = await check(md5, file.name);
    if (checkRes.path) {
      console.log("already exists");
      setConfirmUpload(false)
      setUploading(false);
      setUploadingDialog(false);
      return;
    }
    let startTime = Date.now();
    let uploadedBytes = 0;
    let chunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadPromise = [];
    for (let i = 0; i < chunks; i++) {
      console.log(checkRes.uploadedChunks.includes(i));
      if (checkRes.uploadedChunks && checkRes.uploadedChunks.includes(i + 1)) {
        continue;
      }
      let start = i * CHUNK_SIZE;
      let end = start + CHUNK_SIZE >= file.size ? file.size : start + CHUNK_SIZE;
      const blob = file.slice(start, end);
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('chunkNumber', i + 1);
      formData.append('currentChunkSize', end - start);
      formData.append('chunkSize', CHUNK_SIZE);
      formData.append('totalSize', file.size);
      formData.append('totalChunks', chunks);
      formData.append('identifier', md5);
      formData.append('filename', file.name);
      formData.append('chunkIdentifier', slice[i]);
      const up = upload(formData, 3, (progressEvent) => {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000;
        uploadedBytes += progressEvent.loaded;
        const speed = (uploadedBytes / elapsedTime) * 8 / (1024 * 1024);
        setUploadRate(speed.toFixed(2));
      })
          .then(() => {
            setUploadProgress((prev) => prev + (1 / chunks) * 100);
            console.log('upload success');
          }).catch(error => {
            console.log(error);
          });
      uploadPromise.push(up);
    }

    await Promise.all(uploadPromise);

    const res = await merge({
      name: file.name,
      identifier: md5,
      totalChunks: chunks,
      resourcesCategory: "FIGURE",
      resourcesType: "VIDEO",
      access: false
    });
    if (res) {
      console.log("success!!!")
    } else {
      console.log("error!!!");
    }
    cancelUpload();
  }

  const DrawerList = (
      <Box sx={{width: 250}} role="presentation" onClick={toggleDrawer(false)}>
        <List>

          <ListItem key={'logout'} disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon/>
              </ListItemIcon>
              <ListItemText primary={'logout'}/>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider/>

      </Box>
  );

  const ResourcesList = (
      <Box sx={{width: 600}} role="presentation">
        <Box sx={{width: '80%', margin: 'auto'}}>
          <List>
            <ListItem key={'search'} sx={{paddingLeft: 0}}>
              <TextField
                  variant="outlined"
                  placeholder="Search..."
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon/>
                        </InputAdornment>
                    ),
                  }}
                  sx={{width: 300}}
              />
              <input
                  type="file"
                  ref={resourcesRef}
                  style={{display: 'none'}}
                  onChange={handleFileChange}/>
              <Box sx={{position: 'relative', display: 'inline-block'}}>
                <Button sx={{ position: 'relative', marginLeft: 2, backgroundColor: "transparent", boxShadow: "none"}}
                        variant="contained"
                        color='inherit'
                        disabled={loading}
                        startIcon={<CloudQueueIcon/>}
                        onClick={resourcesButtonClick}
                >
                  Upload
                  {loading && <CustomCircularProgress size={24} sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}/>}
                </Button>

              </Box>
            </ListItem>
          </List>
        </Box>
        <Box sx={{width: '80%', margin: 'auto'}}>
          <ResourcesTable />
        </Box>
        <Dialog open={uploadingDialog} onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') setUploadingDialog(false);
        }} aria-labelledby="unclosable-dialog-title" aria-describedby="unclosable-dialog-description"
                sx={{zIndex: 10000}}>
          {!confirmUpload && file && (
              <>
                <DialogTitle id="unclosable-dialog-title">{`Sure to upload ${file.name} ?`}</DialogTitle>
                <DialogActions>
                  <Button onClick={startUpload} color="primary">Yes</Button>
                  <Button onClick={cancelUpload} color="error">No</Button>
                </DialogActions>
              </>
          )}
          {confirmUpload && file && (
              <>
                <DialogTitle id="unclosable-dialog-title">{`Uploading ${file.name}...Wait for a second...`}</DialogTitle>
                <DialogContent>
                  <CustomLinearProgress value={uploadProgress.toFixed(2)} rate={uploadRate}/>
                </DialogContent>
              </>
          )}
        </Dialog>
      </Box>
  );


  return (

      <Box>
        <Drawer open={open} onClose={toggleDrawer(false)} anchor='right' sx={{zIndex: 9999}}>
          {DrawerList}
        </Drawer>
        <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '12px',
              zIndex: 9999, // Ensure the box stays on top
            }}
        >
          <Typography onClick={toggleDrawer(true)}
                      sx={{
                        '&:hover': {
                          cursor: 'pointer'
                        }
                      }}
                      variant="body2"
          >
            {!isSmallScreen && (user ? truncate(user.username) : '')}
            {isSmallScreen && <ListIcon sx={{padding: '2px'}}/>}
            {/* { user ? user.email : ''} */}
          </Typography>


        </Box>

        <Drawer open={resources} onClose={toggleResourcesDrawer(false)} anchor='left'
                PaperProps={{
                  sx: {
                    background: 'linear-gradient(to right, white, rgba(255, 255, 255, 0))',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'none',
                    border: "none",
                    width: 600, // 保持一致的宽度
                  },
                }}
                sx={{zIndex: 9999}}
        >
          {ResourcesList}
        </Drawer>
        <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              padding: '12px',
              zIndex: 9999, // Ensure the box stays on top
            }}
        >
          <IconButton
              variant="contained"
              color="default"
              onClick={toggleResourcesDrawer(true)}
              sx={{
                position: 'relative',
                zIndex: 1,
                borderRadius: '50%', // 确保边框跟随圆形图标按钮
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  zIndex: -1,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #FF4081, #FF9100, #FFEA00, #3D5AFE, #651FFF)',
                  padding: '5px', // 调整边框粗细
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'destination-out',
                  maskComposite: 'exclude',
                },
                '&:hover::before': {
                  filter: 'brightness(1.2)', // 悬停时边框高亮
                },
              }}
          >
            <StorageIcon/>
          </IconButton>

        </Box>

        <TabContext value={value}>
          <Box sx={{
            height: 50,
            borderBottom: 1,
            borderColor: 'divider',
            position: 'relative',
            zIndex: 1400,
            bgcolor: "white"
          }}>
            <TabList onChange={handleChange} aria-label="tabs" centered>
              <AntTab label="Inference" value="1" style={{minWidth: 50}}/>
              <AntTab label="Training" value="2" style={{minWidth: 50}}/>
              <AntTab label="Models" value="3" style={{minWidth: 50}}/>
              <AntTab label="Resources" value="4" style={{minWidth: 50}}/>
              <AntTab label="Tools" value="5" style={{minWidth: 50}}/>
            </TabList>
          </Box>

          <TabPanel value="1" keepMounted={true}>
            <Inference value={value} index={0}/>
          </TabPanel>

          <TabPanel value="2" keepMounted={true}>
            <Training value={value} index={1}/>
          </TabPanel>

          <TabPanel value="3" keepMounted={true}>
            <Models/>
          </TabPanel>

          <TabPanel value="4" keepMounted={true}>
            <Resources/>
          </TabPanel>

          <TabPanel value="5" keepMounted={true}>
            <Tools/>
          </TabPanel>

        </TabContext>
      </Box>


  );
}
