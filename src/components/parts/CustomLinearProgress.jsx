import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
  const {value, rate} = props;
  return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" value={value} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${rate}Mb/s`}</Typography>
        </Box>
      </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  rate: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default function CustomLinearProgress(props) {
  const classes = useStyles();

  return (
      <div className={classes.root}>
        <LinearProgressWithLabel {...props} />
      </div>
  );
}
