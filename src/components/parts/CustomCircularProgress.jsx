import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from "@mui/material";

const useStylesCustom = makeStyles(() => ({
  bottom: {
    color: '#d1eaff',
  },
  top: {
    color: '#1a90ff',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

export default function CustomizedProgressBars(props) {
  const classes = useStylesCustom();
  const { sx, ...otherProps } = props;

  return (
      <Box sx={sx}>
        <CircularProgress
            variant="determinate"
            className={classes.bottom}
            size={40}
            thickness={4}
            {...otherProps}
            value={100}
        />
        <CircularProgress
            variant="indeterminate"
            disableShrink
            className={classes.top}
            classes={{
              circle: classes.circle,
            }}
            size={40}
            thickness={4}
            {...otherProps}
        />
      </Box>
  );
}
//
// export default function CustomizedProgressBars(props) {
//   return (
//       <CustomCircularProgress {...props}/>
//   );
// }
