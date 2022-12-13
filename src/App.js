import { connect, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from './routes';
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import DashboardFooter from './layouts/dashboard/DashboardFooter';
// ----------------------------------------------------------------------

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return (
    <ThemeConfig>
      <Toaster />
      <ToastContainer
        autoClose={2000}
        position="top-center"
        newestOnTop
        draggable={false}
        theme="colored"
        transition={Flip}
        limit={3}
      />
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Router isLoggedIn={isLoggedIn} />
      <DashboardFooter />
    </ThemeConfig>
  );
}
const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(App);
