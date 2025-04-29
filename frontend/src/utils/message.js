import {toast} from 'react-toastify'

export const successMsg = msg => {
  toast.success(msg)
}

export const failureMsg = msg => {
  toast.error(msg)
}
