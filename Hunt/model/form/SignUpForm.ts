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
  emailDisable?: boolean;

  phone?: string;
  phoneTouched?: boolean;
  phoneError?: string;
  isPhoneValid?: boolean;
  phoneDisable?: boolean;

  password?: string;
  passwordTouched?: boolean;
  passwordError?: string;
  isPasswordValid?: boolean;
  hiddePassword?: boolean;
  passwordDisable?: boolean;

  confirmPassword?: string;
  confirmPasswordTouched?: boolean;
  confirmPasswordError?: string;
  isConfirmPasswordValid?: boolean;
  hiddeConfirmPassword?: boolean;
  confirmPasswordDisable?: boolean;

  hutName?: string;
  hutNameTouched?: boolean;
  hutNameError?: string;
  isHutNameValid?: boolean;

  hutNumber?: string;
  hutNumberTouched?: boolean;
  hutNumberError?: string;
  isHutNumberValid?: boolean;

  postalLocation?: string;
  postalLocationTouched?: boolean;
  postalLocationError?: string;
  isPostalLocationValid?: boolean;

  isOwner?: boolean;
  isValidForm: boolean;
}

export class SignUpForm implements ISignUpForm {
  UUID?: string;
  fullName: string;
  fullNameTouched: boolean;
  fullNameError: string;
  isFullNameValid: boolean;
  email: string;
  emailTouched: boolean;
  emailError: string;
  isEmailValid: boolean;
  emailDisable: boolean;
  phone: string;
  phoneTouched: boolean;
  phoneError: string;
  isPhoneValid: boolean;
  phoneDisable: boolean;
  password: string;
  passwordTouched: boolean;
  passwordError: string;
  isPasswordValid: boolean;
  hiddePassword: boolean;
  passwordDisable: boolean;
  confirmPassword: string;
  confirmPasswordTouched: boolean;
  confirmPasswordError: string;
  isConfirmPasswordValid: boolean;
  hiddeConfirmPassword: boolean;
  confirmPasswordDisable: boolean;
  hutName: string;
  hutNameTouched: boolean;
  hutNameError: string;
  isHutNameValid: boolean;
  hutNumber: string;
  hutNumberTouched: boolean;
  hutNumberError: string;
  isHutNumberValid: boolean;
  postalLocation?: string;
  postalLocationTouched?: boolean;
  postalLocationError?: string;
  isPostalLocationValid?: boolean;
  isOwner: boolean;
  isValidForm: boolean;

  constructor(
    UUID?: string,
    fullName?: string,
    email?: string,
    phone?: string,
    password?: string,
    confirmPassword?: string,
    hutName?: string,
    hutNumber?: string,
    postalLocation?: string
  ) {
    this.UUID = UUID || "";
    this.fullName = fullName || "";
    this.fullNameTouched = this.fullName != "" ? true : false;
    this.fullNameError = "";
    this.isFullNameValid = this.fullName != "" ? true : false;
    this.email = email || "";
    this.emailTouched = this.email != "" ? true : false;
    this.emailError = "";
    this.emailDisable = this.email != "" ? false : true;
    this.isEmailValid = this.email != "" ? true : false;
    this.phone = phone || "";
    this.phoneTouched = this.phone != "" ? true : false;
    this.phoneError = "";
    this.isPhoneValid = this.phone != "" ? true : false;
    this.phoneDisable = this.phone != "" ? false : true;
    this.password = password || "";
    this.passwordTouched = this.password != "" ? true : false;
    this.passwordError = "";
    this.isPasswordValid = this.password != "" ? true : false;
    this.hiddePassword = true;
    this.passwordDisable = this.password != "" ? false : true;
    this.confirmPassword = confirmPassword || "";
    this.confirmPasswordTouched = this.confirmPassword != "" ? true : false;
    this.confirmPasswordError = "";
    this.isConfirmPasswordValid = this.confirmPassword != "" ? true : false;
    this.hiddeConfirmPassword = true;
    this.confirmPasswordDisable = this.confirmPassword != "" ? false : true;
    this.hutName = hutName || "";
    this.hutNameTouched = this.hutName != "" ? true : false;
    this.hutNameError = "";
    this.isHutNameValid = this.hutName != "" ? true : false;
    this.hutNumber = hutNumber || "";
    this.hutNumberTouched = this.hutNumber != "" ? true : false;
    this.hutNumberError = "";
    this.isHutNumberValid = this.hutNumber != "" ? true : false;
    this.postalLocation = postalLocation || "";
    this.postalLocationTouched = this.postalLocation != "" ? true : false;
    this.postalLocationError = "";
    this.isPostalLocationValid = this.postalLocation != "" ? true : false;
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
