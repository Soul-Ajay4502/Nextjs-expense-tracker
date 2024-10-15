
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          <Link href="/dashboard" color="inherit" underline="none">
            NextExpenseTracker
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
