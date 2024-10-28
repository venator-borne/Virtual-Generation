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
import {useEffect, useState} from 'react';
import {Backdrop, Button, IconButton, InputAdornment, SvgIcon, TextField, Typography} from '@mui/material';
import {logout} from '../../lib/api.js';
import {styled} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import ListIcon from '@mui/icons-material/List';
import {useSelector} from "react-redux";
import {red} from "@mui/material/colors";

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

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleResourcesDrawer = (newOpen) => () => {
        setResources(newOpen);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
        localStorage.setItem('tab-index', newValue);
        // workaround: get all open selects and click to close
        const openSelects = document.getElementsByClassName('MuiBackdrop-root');
        for (let openSelect of openSelects) {
            openSelect.click();
        }
    };

    useEffect(() => {
        // localStorage.setItem('loggedIn', true);
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

    const handSelectFile = () => {

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
            <List>
                <ListItem key={'search'}>
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />
                    <Button sx={{marginLeft: 2, backgroundColor: "transparent", boxShadow: "none"}}
                            variant="contained"
                            color='inherit'
                            startIcon={<CloudQueueIcon />}
                            onClick={handSelectFile}
                    >
                        Upload
                    </Button>
                </ListItem>
            </List>
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
                    <StorageIcon />
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
