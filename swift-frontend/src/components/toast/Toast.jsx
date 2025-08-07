import Notify from 'simple-notify';
import 'simple-notify/dist/simple-notify.css';

// https://www.cssscript.com/toast-simple-notify/ - documentação do toast

function showToast(type, title, text) {
  new Notify({
    status: type,
    title: title,
    text: text,
    effect: 'fade',
    speed: 300,
    autoclose: true,
    autotimeout: 3000,
    position: 'right top',
  });
}

export default showToast;
