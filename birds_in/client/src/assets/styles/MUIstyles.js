import styled from '@emotion/styled';
import { Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: 'rgba(0, 56, 28, 0.1)',
    backdropFilter: 'blur(5px)',
    borderRadius: '10px 10px 0px 0px',
    marginTop: '0px',
    marginRight: '10%',
    marginLeft: '10%',
    color: theme.palette.primary.main, 
    '& .Mui-selected': {
        backgroundColor: theme.palette.secondary.light,
    },
}));

export const StyledTab = styled(Tab)({
    minWidth: 'auto',
    textTransform: 'none',
    color: '#ccd6cc',
    '&.Mui-selected .MuiTypography-root': {
        color: '#C1C700',
    },
});

export const useLabelStyles = () => {
    const theme = useTheme();
    return {
        color: theme.palette.primary.main,
        marginTop: '-9px',
    };
};

export const useInputStyles = () => {
    const theme = useTheme();
    return {
        color: theme.palette.primary.light,
        backgroundColor: 'rgba(204, 214, 204, 0.17)',
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
            backgroundColor: 'rgba(204, 214, 204, 0.17)',
        },
        '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
            height: '40px',
        },
    };
};