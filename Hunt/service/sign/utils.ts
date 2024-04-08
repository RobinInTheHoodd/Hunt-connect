import { faL } from "@fortawesome/free-solid-svg-icons";
import { ISignUpForm } from "../../model/form/SignUpForm";
import { FirebaseError } from "../../utils/firebaseError";

export class UtilsSign {
  static validateEmail(signForm: ISignUpForm, value: string): ISignUpForm {
    const email = value;
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    try {
      if (email == "") throw "L'email est obligatoire";
      if (!regex.test(String(email).toLowerCase()))
        throw "L'addresse email est incorrecte";
      if (email.length > 90) throw "Caractère maximum autorisé : 90";
      if (email.length < 7) throw "Caractère minimum autorisé : 7";

      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        email: value,
        emailError: "",
        isEmailValid: true,
        emailTouched: true,
      };
    } catch (e: any) {
      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        email: value,
        emailError: e,
        isEmailValid: false,
        emailTouched: true,
      };
    }
  }

  static validateName(signForm: ISignUpForm, value: string): ISignUpForm {
    let fullName = value;
    const regex = /^[a-zA-ZçÇéÉèÈêÊëËîÎïÏôÔöÖûÛüÜàÀâÂäÄÿŸ\- ]+$/;
    try {
      if (fullName == "") throw "Prénom nom est obligatoire";
      if (fullName.length > 39) throw "Caractère maximun autorisé : 39";
      if (fullName.length < 8) throw "Caractère minimum autorisé : 8";
      if (!regex.test(String(fullName).toLowerCase()))
        throw "Caractère autorisé : lettres, accents, et tirets autorisés.";

      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        fullName: value,
        fullNameError: "",
        isFullNameValid: true,
        fullNameTouched: true,
      };
    } catch (e: any) {
      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        fullName: value,
        fullNameError: e,
        isFullNameValid: false,
        fullNameTouched: true,
      };
    }
  }

  static validatePhone(signForm: ISignUpForm, value: string): ISignUpForm {
    let phone = value;

    try {
      if (phone == "") throw "Le numéro de téléphone est obligatoire.";
      if (!phone.match(/^[0-9]+$/))
        throw "Le numéro ne doit contenir que des chiffres ";
      if (phone.length != 10) throw "Le numéro doit contenir entre 10 chiffres";

      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        phone: value,
        phoneError: "",
        isPhoneValid: true,
        phoneTouched: true,
      };
    } catch (e: any) {
      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        phone: value,
        phoneError: e,
        isPhoneValid: false,
        phoneTouched: true,
      };
    }
  }

  static validatePostalCode(signForm: ISignUpForm, value: string): ISignUpForm {
    let postalCode = value;

    try {
      if (postalCode == "") throw "Le numéro de téléphone est obligatoire.";
      if (postalCode.length < 7)
        throw "Le numéro doit contenir plus de 7 caractères";

      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        postalLocation: value,
        postalLocationError: "",
        isPostalLocationValid: true,
        postalLocationTouched: true,
      };
    } catch (e: any) {
      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        postalLocation: value,
        postalLocationError: e,
        isPostalLocationValid: false,
        postalLocationTouched: true,
      };
    }
  }

  static validatePassword(signForm: ISignUpForm, value: string): ISignUpForm {
    const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,20}$/;

    let password = value;

    try {
      if (password == "") throw "Le mot de passe est obligatoire.";
      if (!password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,20}$/))
        throw "Le mot de passe doit contenir 8-20 caractères avec au moins un chiffre, une majuscule et un symbole.";

      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        password: value,
        passwordError: "",
        isPasswordValid: true,
        passwordTouched: true,
      };
    } catch (e: any) {
      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        password: value,
        passwordError: e,
        isPasswordValid: false,
        passwordTouched: true,
      };
    }
  }

  static validateConfirmPassword(
    signForm: ISignUpForm,
    value: string
  ): ISignUpForm {
    let password = signForm.password;
    let confirm = value;

    try {
      if (confirm == "")
        throw "La confirmation du mot de passe est obligatoire";
      if (password != confirm)
        throw "La confirmation du mot de passe est différent";

      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        confirmPassword: value,
        confirmPasswordError: "",
        isConfirmPasswordValid: true,
        confirmPasswordTouched: true,
      };
    } catch (e: any) {
      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        confirmPassword: value,
        confirmPasswordError: e,
        isConfirmPasswordValid: false,
        confirmPasswordTouched: true,
      };
    }
  }

  static validateHutName(signForm: ISignUpForm, value: string): ISignUpForm {
    let hutName = value;
    let error: string = "";
    let isValid: boolean = true;

    try {
      if (signForm.isOwner) {
        if (hutName == "") throw "Le nom de la hutte est obligatoire";
        if (hutName.length > 35) throw "Caractère maximum autorisé : 35";
        if (hutName.length < 5) throw "Caractère minimum autorisé : 5";
      }
    } catch (e: any) {
      error = e;
      isValid = false;
    } finally {
      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        hutName: value,
        hutNameError: error,
        isHutNameValid: isValid,
        hutNameTouched: true,
      };
    }
  }

  static validateHutNumber(signForm: ISignUpForm, value: string): ISignUpForm {
    let hutNumber = value;
    let regex = /^[0-9]+$/;

    try {
      if (signForm.isOwner) {
        if (hutNumber == "") throw "Le numéro de la hutte est obligatoire";
        if (!hutNumber.match(regex))
          throw "Le numéro de la hute contient seulement des chiffres";
        if (hutNumber.length > 35) throw "Caractère maximum autorisé : 35";
        if (hutNumber.length < 5) throw "Caractère minimum autorisé : 5";
      }
      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        hutNumber: value,
        hutNumberError: "",
        isHutNumberValid: true,
        hutNumberTouched: true,
      };
    } catch (e: any) {
      return {
        ...signForm,
        isValidForm: UtilsSign.validateForm(signForm),
        hutNumber: value,
        hutNumberError: e,
        isHutNumberValid: false,
        hutNumberTouched: true,
      };
    }
  }

  static checkForm(signForm: ISignUpForm): ISignUpForm {
    signForm = this.validateEmail(signForm, signForm.email!);
    signForm = this.validateName(signForm, signForm.fullName!);
    signForm = this.validatePhone(signForm, signForm.phone!);
    signForm = this.validatePassword(signForm, signForm.password!);
    signForm = this.validateConfirmPassword(
      signForm,
      signForm.confirmPassword!
    );
    signForm = this.validateHutName(signForm, signForm.hutName!);
    signForm = this.validateHutNumber(signForm, signForm.hutNumber!);

    return {
      ...signForm,
    };
  }

  static validateSignInForm(signForm: ISignUpForm) {
    const areEmailAndPasswordValid =
      signForm.isEmailValid! && signForm.isPasswordValid!;
    return areEmailAndPasswordValid;
  }

  static validateForm(signForm: ISignUpForm): boolean {
    const areEmailAndPasswordValid =
      signForm.isEmailValid! && signForm.isPasswordValid!;

    const areOtherFieldsValid = [
      signForm.isFullNameValid,
      signForm.isPhoneValid,
      signForm.isConfirmPasswordValid,
      signForm.isHutNameValid,
      signForm.isHutNumberValid,
    ].every((field) => field === undefined || field);

    return areEmailAndPasswordValid && areOtherFieldsValid;
  }

  static errorToFormFieldMap: { [key: string]: keyof ISignUpForm } = {
    display_name: "fullName",
    email: "email",
    [FirebaseError.EMAIL_EXISTS]: "email",
    [FirebaseError.INVALID_EMAIL]: "email",
    [FirebaseError.USER_DISABLED]: "email",
    [FirebaseError.USER_DELETED]: "email",
    [FirebaseError.NEED_CONFIRMATION]: "email",
    [FirebaseError.TOO_MANY_ATTEMPTS_TRY_LATER]: "password",
    user_role: "isOwner",
    password: "password",
    [FirebaseError.INVALID_LOGIN_CREDENTIALS]: "password",
    [FirebaseError.WEAK_PASSWORD]: "password",
    [FirebaseError.INVALID_PASSWORD]: "password",
    phone: "phone",
    [FirebaseError.INVALID_PHONE_NUMBER]: "phone",
    [FirebaseError.MISSING_PHONE_NUMBER]: "phone",
    hut_name: "hutName",
    hut_nunber: "hutNumber",
  };

  static ErrorForm = (
    signform: ISignUpForm,
    errorCode: string
  ): ISignUpForm => {
    if (
      errorCode == FirebaseError.INVALID_LOGIN_CREDENTIALS ||
      errorCode == FirebaseError.TOO_MANY_ATTEMPTS_TRY_LATER
    ) {
      let passError: string = UtilsSign.mapApiErrorToForm(errorCode) as string;
      return {
        ...signform,
        email: "",
        emailError: "",
        emailTouched: true,
        isEmailValid: false,
        password: "",
        passwordError: passError,
        passwordTouched: true,
        isPasswordValid: false,
      };
    } else {
      const formFieldName = UtilsSign.mapApiFieldToForm(errorCode);
      const formFieldErrorName = formFieldName + "Error";
      const formFielIsValid =
        "is" +
        formFieldName!.charAt(0).toUpperCase() +
        formFieldName!.slice(1) +
        "Valid";
      const formFielTouched = formFieldName + "Touched";

      return {
        ...signform,
        [formFielTouched]: true,
        [formFieldErrorName]: UtilsSign.mapApiErrorToForm(errorCode),
        [formFielIsValid]: false,
        password: "",
      };
    }
  };

  static errorMessageToFormFieldMap: { [key: string]: keyof any } = {
    [FirebaseError.EMAIL_EXISTS]: "Cette adresse e-mail est déjà utilisée.",
    [FirebaseError.INVALID_EMAIL]: "L'adresse e-mail fournie est invalide.",
    [FirebaseError.USER_DISABLED]:
      "Votre compte a été désactivé. Cela peut être dû à des activités inhabituelles ou au non-respect de nos termes et conditions.",
    [FirebaseError.USER_DELETED]:
      "Il semble que votre compte ait été supprimé et n'est plus accessible.",
    [FirebaseError.TOO_MANY_ATTEMPTS_TRY_LATER]:
      "Vous avez atteint le nombre maximum de tentatives autorisées pour le moment.",
    [FirebaseError.INVALID_LOGIN_CREDENTIALS]:
      "Les informations de connexion fournies sont incorrectes.",
    [FirebaseError.WEAK_PASSWORD]:
      "Le mot de passe que vous avez choisi est trop faible.",
    [FirebaseError.INVALID_PASSWORD]:
      "Le mot de passe que vous avez saisi est incorrect.",
    [FirebaseError.INVALID_PHONE_NUMBER]: "phone",
    [FirebaseError.MISSING_PHONE_NUMBER]: "phone",
    [FirebaseError.NEED_CONFIRMATION]:
      "Cette adresse e-mail est déjà utilisée par un autre service.",
  };

  static mapApiErrorToForm = (apiFieldError: string): keyof any | null => {
    return UtilsSign.errorMessageToFormFieldMap[apiFieldError] || null;
  };

  static mapApiFieldToForm = (
    apiFieldName: string
  ): keyof ISignUpForm | null => {
    return UtilsSign.errorToFormFieldMap[apiFieldName] || null;
  };
}
