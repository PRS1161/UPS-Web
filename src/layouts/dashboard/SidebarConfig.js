// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'device',
    path: '/devices',
    icon: getIcon('tabler:device-heart-monitor')
  }
];

export default sidebarConfig;
