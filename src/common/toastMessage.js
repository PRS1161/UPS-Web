import toast from 'react-hot-toast';

const toasterPosition = 'bottom-left';

const toaster = {
  success(message) {
    toast.success(message, {
      position: toasterPosition,
      style: {
        color: '#000',
        minWidth: 150,
        padding: 10,
        fontWeight: 500,
        marginBottom: 60,
        border: '1px solid #3366FF'
      },
      iconTheme: { primary: '#3366FF', secondary: '#fff' }
    });
  },
  error(message) {
    toast.error(message, {
      position: toasterPosition,
      style: {
        color: '#000',
        fontWeight: 500,
        padding: 10,
        marginBottom: 60,
        border: '1px solid #ff0000'
      }
    });
  }
};

export default toaster;
