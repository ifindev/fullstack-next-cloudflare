export const VALIDATION_LIMITS = {
    TODO: {
        TITLE_MIN: 3,
        TITLE_MAX: 255,
        DESCRIPTION_MAX: 1000,
        IMAGE_ALT_MAX: 255,
    },
    UPLOAD: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png"],
    },
} as const;

export const VALIDATION_MESSAGES = {
    REQUIRED: "This field is required",
    EMAIL_INVALID: "Please enter a valid email address",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    USERNAME_TOO_SHORT: "Username must be at least 3 characters",
    FILE_TOO_LARGE: "File size must be less than 5MB",
    INVALID_FILE_TYPE: "Only JPEG and PNG files are allowed",
} as const;

export const TODO_VALIDATION_MESSAGES = {
    TITLE_REQUIRED: "Title is required",
    TITLE_TOO_LONG: "Title must be less than 255 characters",
    DESCRIPTION_TOO_LONG: "Description must be less than 1000 characters",
    INVALID_IMAGE_URL: "Invalid image URL",
} as const;
