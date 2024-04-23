import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    margin: 'auto',
    backgroundColor: 'rgba(0, 56, 28, 0.1)',
    backdropFilter: 'blur(2px)',
    padding: '0px 40px 30px 0px',
    borderRadius: '0px 0px 20px 20px',
  },
  sectionTitle: {
    color: theme.palette.primary.light,
  },
  textInput: {
    color: theme.palette.primary.light,
    backgroundColor: 'rgba(204,214,204,0.17)',
    borderRadius: '9px',
    '& .MuiInputBase-input': {
      padding: '0px',
      paddingLeft: '10px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      backgroundColor: 'rgba(204,214,204,0.17)',
    },
    '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
      height: '40px',
    },
  },
  saveButton: {
    fontSize: '1.3rem',
    padding: '5px 10px',
    fontWeight: 'bold',
    mt: 2,
    textTransform: 'none',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.light,
      textTransform: 'none',
    },
  },
}));
