import Swal from "sweetalert2";
import "./alert.css";

const ICON_COLORS = {
  success: "#2E3192",
  error: "#c0392b",
  warning: "#F6A824",
  info: "#00AEEF",
};

/**
 * Branded modal alert for booking/inquiry feedback.
 */
export function showAlert({ icon = "info", title, text, confirmText = "Continue" }) {
  return Swal.fire({
    icon,
    title,
    text,
    iconColor: ICON_COLORS[icon] || ICON_COLORS.info,
    confirmButtonText: confirmText,
    buttonsStyling: false,
    reverseButtons: true,
    focusConfirm: true,
    customClass: {
      popup: "btd-alert-popup",
      title: "btd-alert-title",
      htmlContainer: "btd-alert-text",
      confirmButton: "btd-alert-confirm",
      icon: "btd-alert-icon",
    },
  });
}

export function showSuccessAlert(title, text) {
  return showAlert({ icon: "success", title, text, confirmText: "Done" });
}

export function showErrorAlert(title, text) {
  return showAlert({ icon: "error", title, text, confirmText: "Try again" });
}

export function showWarningAlert(title, text) {
  return showAlert({ icon: "warning", title, text, confirmText: "OK" });
}
