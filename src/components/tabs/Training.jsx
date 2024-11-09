import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import "cropperjs/dist/cropper.css";
import Box from '@mui/material/Box';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import {
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Skeleton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  topic: yup.object().shape({
    identifier: yup.string().required('A train topic is required')
  }),
  trainingFile: yup.object().shape({
    identifier: yup.string().required('Training file is required')
  }),
  access: yup.boolean().required('Access mode is required'),
  model: yup.string().required('Model is required'),
  name: yup.string().required('Name is required')
});

export default function Training() {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleStartTraining = async () => {

  }

  return (
      <Grid container spacing={5} direction="column">
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid size={3}>
              <form onSubmit={handleSubmit(handleStartTraining)}>
                <Box display="flex" flexDirection="column" gap={2} sx={{mt: 2}}>
                  <Box display="flex" gap={2}>
                    <FormControl fullWidth margin="normal" variant="outlined" size="small">
                      <InputLabel id="training-topic">Select Training Topic</InputLabel>
                      <Controller
                          render={({field}) => (
                              <Select
                                  {...field}
                                  defaultValue={null}
                                  labelId="training-file-label"
                                  label="Select Training File"
                                  value={field.value}
                                  renderValue={(selected) => selected ? selected.name : ''}
                                  onChange={(e) => field.onChange(e.target.value)}
                              >
                              </Select>
                          )}
                          name='topic'
                          control={control}
                          defaultValue={null}
                      />
                      {errors.topic ? (
                          <FormHelperText error>{errors.topic.message}</FormHelperText>
                      ) : (
                          <FormHelperText>&nbsp;</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl fullWidth margin="normal" variant="outlined" size="small">
                      <InputLabel id="training-file-label">Select Training File</InputLabel>
                      <Controller
                          render={({field}) => (
                              <Select
                                  {...field}
                                  defaultValue={null}
                                  labelId="training-file-label"
                                  label="Select Training File"
                                  value={field.value}
                                  renderValue={(selected) => selected ? selected.name : ''}
                                  onChange={(e) => field.onChange(e.target.value)}
                              >
                              </Select>
                          )}
                          name='trainingFile'
                          control={control}
                          defaultValue={null}
                      />
                      {errors.trainingFile ? (
                          <FormHelperText error>{errors.trainingFile.message}</FormHelperText>
                      ) : (
                          <FormHelperText>&nbsp;</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <Box display="flex" gap={2}>
                    <FormControl fullWidth margin="normal" variant="outlined" size="small">
                      <InputLabel id="access-level-label">Select Access</InputLabel>
                      <Controller
                          render={({field}) => (
                              <Select
                                  {...field}
                                  defaultValue=""
                                  labelId="access-level-label"
                                  label="Access Level"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value === "PUBLIC")}
                              >
                                <MenuItem value="PUBLIC">PUBLIC</MenuItem>
                                <MenuItem value="PRIVATE">PRIVATE</MenuItem>
                              </Select>
                          )}
                          name='access'
                          control={control}
                          defaultValue=''
                      />
                      {errors.access ? (
                          <FormHelperText error>{errors.access.message}</FormHelperText>
                      ) : (
                          <FormHelperText>&nbsp;</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl fullWidth margin="normal" variant="outlined" size="small">
                      <InputLabel>Model</InputLabel>
                      <Controller
                          render={({field}) => (
                              <Select
                                  {...field}
                                  defaultValue=""
                                  label="Model"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                              >
                              </Select>
                          )}
                          name='model'
                          control={control}
                          defaultValue=''
                      />
                      <FormHelperText error>
                        {errors.model?.message || '\u00A0'}
                      </FormHelperText>
                    </FormControl>
                  </Box>

                  <Box display="flex" gap={2}>
                    <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        size="small"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message || '\u00A0'}
                    />
                  </Box>

                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" sx={{mt: 2}}>Preprocess</Button>
                    <Button type="submit" variant="contained" sx={{mt: 2}}>Start</Button>
                  </Box>
                </Box>
              </form>
            </Grid>
            <Grid size={9}>
              <Card sx={{marginTop: '10px'}}>
                <CardContent>
                  <b>Preview</b>
                  <video controls style={{ width: '100%' }} preload="metadata">
                    Your browser does not support the video element.
                  </video>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <b>Training Status</b>
          <Box mt={2} p={2} border={1} borderColor="grey.300" borderRadius={4}>
            <Skeleton animation={false} height={30}/>
          </Box>
        </Grid>
        <Grid size={12}>
          <b>Training Logs</b>
          <Box mt={2} p={2} border={1} borderColor="grey.300" borderRadius={4}>
            <TextField
                fullWidth
                placeholder="Logs..."
                disabled={true}
                multiline
                rows={5}
                sx={{ mt: 2 }}
                {...register('formInputText')}
                error={!!errors.formInputText}
                helperText={errors.formInputText?.message}
            />
          </Box>
        </Grid>
      </Grid>
  )
}
