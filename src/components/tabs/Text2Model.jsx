import React, {useState} from 'react';
import {Box, Button, Card, Fab, Grow, IconButton, InputAdornment, InputBase, Paper, TextField} from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import SendIcon from '@mui/icons-material/Send';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";

export default function Text2Model() {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState(['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4']);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <Box display='flex' justifyContent="space-between" alignItems='center' sx={{width: '100%', position: 'relative'}}>
      <Grow in={open}>
        <Box width={open ? '30%' : '0%'} sx={{transition: "width 0.3s"}}>
          <Paper>
            {open && (
              <List minHeight={1000}>
                {topics.map((topic, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={topic}></ListItemText>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Grow>
      <Box
        minHeight={1000}
        width={open ? '70%' : '100%'}
        boxShadow={2}
        sx={{transition: 'width 0.3s', marginLeft: 3, position: 'relative', overflow: 'hidden'}}
      >
        <Box
          style={{position: 'absolute', left: -10, top: -10, height: 80, width: 80, backgroundColor: '#1976d2', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={handleDrawerOpen}
        >
          <SmsIcon sx={{color: 'white'}}/>
        </Box>
          <Box display='flex' alignItems='center'
               sx={{height: '75%', width: '100%', mt: 2, position: 'absolute', top: 0}}>

          </Box>
          {/* 下半部分内容：输入和发送消息 */}
          <Divider/>
          <Box display='flex' alignItems='center'
               sx={{height: '25%', width: '100%', mt: 2, position: 'absolute', bottom: 0}}>
            <InputBase
              fullWidth
              variant="standard"
              placeholder="输入消息..."
              multiline
              rows={7}
              sx={{padding: 5}}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton color="primary" onClick={handleSendMessage}>
                    <SendIcon/>
                  </IconButton>
                </InputAdornment>
              }
            />

          </Box>
      </Box>
      {/*<Box minHeight={1000} width={open ? '70%' : '100%'} boxShadow={2} sx={{ transition: "width 0.3s", marginLeft: 3}}>*/}
      {/*  <Fab sx={{ position: 'absolute'}} color="primary" aria-label="add" onClick={handleDrawerOpen}>*/}
      {/*    <SmsIcon />*/}
      {/*  </Fab>*/}
      {/*  /!*<Box display='flex' flexDirection='column' alignItems='center' sx={{ height: '50%', width: '100%', position: 'relative' }}>*!/*/}

      {/*  /!*</Box>*!/*/}
      {/*  /!*<Box display='flex' flexDirection='column' alignItems='center' sx={{ height: '50%', width: '100%', position: 'relative' }}>*!/*/}
      {/*  /!*  <Box display='flex' flexDirection='column' alignItems='center' sx={{ height: '100%', width: '100%', mt: 8, position: 'absolute', top: 0 }}>*!/*/}
      {/*  /!*    <Box display='flex' alignItems='center' sx={{ width: '100%', mt: 2 }}>*!/*/}
      {/*  /!*      <TextField*!/*/}
      {/*  /!*        fullWidth*!/*/}
      {/*  /!*        multiline*!/*/}
      {/*  /!*        variant="outlined"*!/*/}
      {/*  /!*        placeholder="Type a message..."*!/*/}
      {/*  /!*        value={message}*!/*/}
      {/*  /!*        onChange={handleMessageChange}*!/*/}
      {/*  /!*      />*!/*/}
      {/*  /!*      <IconButton color="primary" onClick={handleSendMessage}>*!/*/}
      {/*  /!*        <SendIcon />*!/*/}
      {/*  /!*      </IconButton>*!/*/}
      {/*  /!*    </Box>*!/*/}
      {/*  /!*  </Box>*!/*/}
      {/*  /!*</Box>*!/*/}
      {/*</Box>*/}
    </Box>
  );
}