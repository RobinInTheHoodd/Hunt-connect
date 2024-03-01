import { faL } from "@fortawesome/free-solid-svg-icons";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface ISignUpForm {
  UUID?: string;

  fullName?: string;
  fullNameTouched?: boolean;
  fullNameError?: string;
  isFullNameValid?: boolean;

  email?: string;
  emailTouched?: boolean;
  emailError?: string;
  isEmailValid?: boolean;

  phone?: string;
  phoneTouched?: boolean;
  phoneError?: string;
  isPhoneValid?: boolean;

  password?: string;
  passwordTouched?: boolean;
  passwordError?: string;
  isPasswordValid?: boolean;
  hiddePassword?: boolean;

  confirmPassword?: string;
  confirmPasswordTouched?: boolean;
  confirmPasswordError?: string;
  isConfirmPasswordValid?: boolean;
  hiddeConfirmPassword?: boolean;

  hutName?: string;
  hutNameTouched?: boolean;
  hutNameError?: string;
  isHutNameValid?: boolean;

  hutNumber?: string;
  hutNumberTouched?: boolean;
  hutNumberError?: string;
  isHutNumberValid?: boolean;

  isOwner?: boolean;
  isValidForm: boolean;
}

export class SignUpForm implements ISignUpForm {
  UUID?: string = "";
  fullName: string | undefined = "";
  fullNameTouched: boolean | undefined = false;
  fullNameError: string | undefined = "";
  isFullNameValid: boolean | undefined = false;
  email: string = "";
  emailTouched: boolean = false;
  emailError: string = "";
  isEmailValid: boolean = false;
  phone: string | undefined = "";
  phoneTouched: boolean | undefined = false;
  phoneError: string | undefined = "";
  isPhoneValid: boolean | undefined = false;
  password: string = "";
  passwordTouched: boolean = false;
  passwordError: string = "";
  isPasswordValid: boolean = false;
  hiddePassword: boolean = false;
  confirmPassword: string | undefined = "";
  confirmPasswordTouched: boolean | undefined = false;
  confirmPasswordError: string | undefined = "";
  isConfirmPasswordValid: boolean | undefined = false;
  hiddeConfirmPassword: boolean | undefined = false;
  hutName: string | undefined = "";
  hutNameTouched: boolean | undefined = false;
  hutNameError: string | undefined = "";
  isHutNameValid: boolean | undefined = false;
  hutNumber: string | undefined = "";
  hutNumberTouched: boolean | undefined = false;
  hutNumberError: string | undefined = "";
  isHutNumberValid: boolean | undefined = false;
  isOwner: boolean | undefined = false;
  isValidForm: boolean = false;

  constructor(
    UUID?: string,
    fullName?: string,
    email?: string,
    phone?: string,
    password?: string,
    confirmPassword?: string,
    hutName?: string,
    hutNumber?: string
  ) {
    this.UUID = UUID || "";
    this.fullName = fullName || "";
    this.fullNameTouched = this.fullName != "" ? true : false;
    this.fullNameError = "";
    this.isFullNameValid = this.fullName != "" ? true : false;
    this.email = email || "";
    this.emailTouched = this.email != "" ? true : false;
    this.emailError = "";
    this.isEmailValid = this.email != "" ? true : false;
    this.phone = phone || "";
    this.phoneTouched = this.phone != "" ? true : false;
    this.phoneError = "";
    this.isPhoneValid = this.phone != "" ? true : false;
    this.password = password || "";
    this.passwordTouched = this.password != "" ? true : false;
    this.passwordError = "";
    this.isPasswordValid = this.password != "" ? true : false;
    this.hiddePassword = true;
    this.confirmPassword = confirmPassword || "";
    this.confirmPasswordTouched = this.confirmPassword != "" ? true : false;
    this.confirmPasswordError = "";
    this.isConfirmPasswordValid = this.confirmPassword != "" ? true : false;
    this.hiddeConfirmPassword = true;
    this.hutName = hutName || "";
    this.hutNameTouched = this.hutName != "" ? true : false;
    this.hutNameError = "";
    this.isHutNameValid = this.hutName != "" ? true : false;
    this.hutNumber = hutNumber || "";
    this.hutNumberTouched = this.hutNumber != "" ? true : false;
    this.hutNumberError = "";
    this.isHutNumberValid = this.hutNumber != "" ? true : false;
    this.isOwner = false;
    this.isValidForm = false;
  }

  static fromUserCredential(userCredential: FirebaseAuthTypes.UserCredential) {
    return new SignUpForm(
      userCredential.user.uid,
      userCredential.user.displayName!,
      userCredential.user.email!,
      userCredential.user.phoneNumber!,
      "FakePassword1-",
      "FakePassword1-",
      "",
      ""
    );
  }
}
