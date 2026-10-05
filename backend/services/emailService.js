import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  LISTING_APPROVED_TEMPLATE,
  LISTING_REJECTED_TEMPLATE,
  ORDER_CONFIRMATION_TEMPLATE,
  WELCOME_TEMPLATE,
} from "../config/emailTemplates.js";

/**
 * Generate HTML email content by type.
 */
export const getEmailHtml = (templateName, vars = {}) => {
  let html = "";
  switch (templateName) {
    case "welcome":
      html = WELCOME_TEMPLATE;
      break;
    case "email_verify":
      html = EMAIL_VERIFY_TEMPLATE;
      break;
    case "password_reset":
      html = PASSWORD_RESET_TEMPLATE;
      break;
    case "listing_approved":
      html = LISTING_APPROVED_TEMPLATE;
      break;
    case "listing_rejected":
      html = LISTING_REJECTED_TEMPLATE;
      break;
    case "order_confirmation":
      html = ORDER_CONFIRMATION_TEMPLATE;
      break;
    default:
      return null;
  }
  // Replace template variables
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value ?? "");
  }
  return html;
};
