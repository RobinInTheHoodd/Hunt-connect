interface SignUpForm {
  fullName: string;
  fullNameTouched: boolean;
  fullNameError: string;
  isFullNameValid: boolean;

  email: string;
  emailTouched: boolean;
  emailError: string;
  isEmailValid: boolean;

  phone: string;
  phoneTouched: boolean;
  phoneError: string;
  isPhoneValid: boolean;

  password: string;
  passwordTouched: boolean;
  passwordError: string;
  isPasswordValid: boolean;
  hiddePassword: boolean;

  confirmPassword: string;
  confirmPasswordTouched: boolean;
  confirmPasswordError: string;
  isConfirmPasswordValid: boolean;
  hiddeConfirmPassword: boolean;

  hutName: string;
  hutNameTouched: boolean;
  hutNameError: string;
  isHutNameValid: boolean;

  hutNumber: string;
  hutNumberTouched: boolean;
  hutNumberError: string;
  isHutNumberValid: boolean;
}
