const apiErrors = {
  REQUIRED_FIELD: { code: "ERR001", label: "Required field" },
  INVALID_EMAIL: { code: "ERR002", label: "Invalid email address" },
  PASSWORD_MIN: {
    code: "ERR003",
    label: "Password must be at least 6 characters",
  },
  USERNAME_MIN: {
    code: "ERR004",
    label: "Username must be at least 3 characters",
  },
  CODE_MIN: { code: "ERR005", label: "Code must be at least 6 characters" },
  MUST_BE_POSITIVE: {
    code: "ERR006",
    label: "Value must be a positive number",
  },
  INVALID_REQUEST_BODY: { code: "ERR007", label: "Invalid request body" },
  USER_NOT_FOUND: { code: "ERR008", label: "User not found" },
  NO_ACCESS_TOKEN: { code: "ERR009", label: "No access token received" },
  NO_VERIFIED_EMAIL: { code: "ERR010", label: "No verified email" },
  INTERNAL_SERVER_ERROR: { code: "ERR011", label: "Internal server error" },
  FAILED_TO_FETCH_USER_INFO: {
    code: "ERR012",
    label: "Failed to fetch user information",
  },
  FAILED_TO_FETCH_ACCESS_TOKEN: {
    code: "ERR013",
    label: "Failed to fetch access token",
  },
  MISSING_TOKEN: { code: "ERR014", label: "Missing token" },
  INVALID_EMAIL_OR_PASSWORD: {
    code: "ERR015",
    label: "Invalid email or password",
  },
  SIGNED_OUT_SUCCESSFULLY: {
    code: "ERR016",
    label: "Signed out successfully",
  },
  ERROR_CREATING_USER: { code: "ERR017", label: "Error creating user" },
  USER_REGISTERED_SUCCESSFULLY: {
    code: "ERR018",
    label: "User registered successfully",
  },
  INVALID_RECOVERY_CODE: { code: "ERR019", label: "Invalid recovery code" },
  EXPIRED_RECOVERY_CODE: { code: "ERR020", label: "Expired recovery code" },
  MISSING_EMAIL_OR_CODE: { code: "ERR021", label: "Missing email or code" },
};

export default apiErrors;
