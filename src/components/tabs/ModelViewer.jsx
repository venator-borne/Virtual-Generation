import React, { Suspense } from "react";
import {Canvas, useLoader} from "@react-three/fiber";
import { OrbitControls, useGLTF, useFBX } from "@react-three/drei";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {Box, Button, FormControl, IconButton, InputLabel, Popover, Select, Typography} from "@mui/material";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import ColorLensIcon from '@mui/icons-material/ColorLens';

function Model() {
    // 加载模型文件，路径为 public 文件夹中的相对路径
    // const { scene } = useLoader(GLTFLoader, '/scene.gltf');
    // const { scene } = useFBX('/black_hole.fbx');
    const { scene } = useGLTF('/scene.gltf');
    return <primitive object={scene} />;
}

const ModelViewer = () => {

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    const [file, setFile] = React.useState(null);
    const [brightAnchorEl, setBrightAnchorEl] = React.useState(null);
    const [axisAnchorEl, setAxisAnchorEl] = React.useState(null);
    const [bgAnchorEl, setBgAnchorEl] = React.useState(null);

    const brightOpen = Boolean(brightAnchorEl);
    const brightId = brightOpen ? 'bright-simple-popover' : undefined;

    const axisOpen = Boolean(axisAnchorEl);
    const axisId = axisOpen ? 'axis-simple-popover' : undefined;

    const bgOpen = Boolean(bgAnchorEl);
    const bgId = axisOpen ? 'bg-simple-popover' : undefined;

    const handleClickOpen = (event, name) => {
        console.log(name);
        if (name === 'bright') {
            setBrightAnchorEl(event.currentTarget);
        } else if (name === 'axis') {
            setAxisAnchorEl(event.currentTarget);
        } else if (name === 'bg') {
            setBgAnchorEl(event.currentTarget);
        }
    };

    const handleClose = (name) => {
        if (name === 'bright') {
            setBrightAnchorEl(null);
        } else if (name === 'axis') {
            setAxisAnchorEl(null);
        } else if (name === 'bg') {
            setBgAnchorEl(null);
        }
    };


    return (
        <Box>
            <Box display="flex">
                <FormControl margin="normal" variant="outlined" size="small">
                    <InputLabel>File</InputLabel>
                    <Select
                        native
                        defaultValue=""
                        label="Model"
                        value={file}
                        onChange={(e) => field.onChange(e.target.value)}
                    >
                        <option aria-label="None" value="" />
                        <option value={10}>Ten</option>
                        <option value={20}>Twenty</option>
                        <option value={30}>Thirty</option>
                    </Select>
                </FormControl>
                <IconButton sx={{marginLeft: 3, borderRadius: 3}} variant="contained" color="default" onClick={(e) => handleClickOpen(e, "bright")}>
                    <WbSunnyIcon />
                </IconButton>
                <Popover id={brightId} open={brightOpen} anchorEl={brightAnchorEl} onClose={() => handleClose("bright")}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Typography >Bright.</Typography>
                </Popover>

                <IconButton sx={{marginLeft: 3, borderRadius: 3}} variant="contained" color="default" onClick={(e) => handleClickOpen(e, "axis")}>
                    <ViewComfyIcon />
                </IconButton>
                <Popover id={axisId} open={axisOpen} anchorEl={axisAnchorEl} onClose={() => handleClose("axis")}
                         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                         transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Typography >Axis.</Typography>
                </Popover>

                <IconButton sx={{marginLeft: 3, borderRadius: 3}} variant="contained" color="default" onClick={(e) => handleClickOpen(e, "bg")}>
                    <ColorLensIcon />
                </IconButton>
                <Popover id={bgId} open={bgOpen} anchorEl={bgAnchorEl} onClose={() => handleClose("bg")}
                         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                         transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Typography >bg.</Typography>
                </Popover>
            </Box>
            <Canvas style={{ height: '100vh' }} camera={{ position: [0, 0, 5], fov: 75 }}>
                {/* 添加环境光和方向光 */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 5, 2]} intensity={1} />

                {/* 加载并显示模型 */}
                <Model />

                {/* 允许用户旋转、缩放和移动视角 */}
                <OrbitControls />
            </Canvas>
        </Box>
    );
};

export default ModelViewer;
