import axios from './axios';
import holdOn from 'react-hold-on';

const setLoading = () => holdOn.open();
const quitLoading = () => holdOn.close();

export {
  axios,
  setLoading,
  quitLoading
}