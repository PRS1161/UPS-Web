import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0
  }
}));

const FooterStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'right',
  padding: theme.spacing(2, 2.5),
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 1.5,
  borderTopRightRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  justifyContent: 'center',
  [theme.breakpoints.up('lg')]: {
    justifyContent: 'flex-end'
  }
}));

export default function DashboardFooter() {
  return (
    <RootStyle>
      <FooterStyle>
        <Typography variant="body1" color="text.secondary">
          &copy; {`Siddhi Electro Power Pvt. Ltd. ${new Date().getFullYear()}.`}
        </Typography>
      </FooterStyle>
    </RootStyle>
  );
}
