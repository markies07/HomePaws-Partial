import Swal from 'sweetalert2';

export const confirm = (title, message) => {
    return Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#D25A5A',
        cancelButtonColor: '#82ac35',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    });
};

export const successAlert = (message) => {
    Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        confirmButtonColor: '#8FBB3E',
        timer: 5000,
    });
};

export const errorAlert = (message) => {
    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonColor: '#D25A5A',
    });
};
