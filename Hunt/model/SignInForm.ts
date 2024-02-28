interface ISignInForm {
  email: string;
  emailTouched: boolean;
  emailError: string;
  isEmailValid: boolean;

  password: string;
  passwordTouched: boolean;
  passwordError: string;
  isPasswordValid: boolean;
  hiddePassword: boolean;
}
