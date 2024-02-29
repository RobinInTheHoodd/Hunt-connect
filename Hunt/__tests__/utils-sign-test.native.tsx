import { ISignUpForm } from "../model/SignUpForm";
import { UtilsSign } from "../service/sign/utils";

describe("UtilsSign", () => {
  let signForm: ISignUpForm;

  beforeEach(() => {
    signForm = {
      fullName: "Robin Mazouni",
      fullNameTouched: false,
      fullNameError: "",
      isFullNameValid: true,

      email: "robin@gmail.com",
      emailTouched: false,
      emailError: "",
      isEmailValid: true,

      phone: "8822093819",
      phoneTouched: false,
      phoneError: "",
      isPhoneValid: true,

      password: "Robin88-",
      passwordTouched: false,
      passwordError: "",
      isPasswordValid: true,
      hiddePassword: true,

      confirmPassword: "Robin88-",
      confirmPasswordTouched: false,
      confirmPasswordError: "",
      isConfirmPasswordValid: true,
      hiddeConfirmPassword: true,

      hutName: "Hut name",
      hutNameTouched: false,
      hutNameError: "",
      isHutNameValid: true,

      hutNumber: "1235467",
      hutNumberTouched: false,
      hutNumberError: "",
      isHutNumberValid: true,

      isOwner: false,
      isValidForm: false,
    };
  });

  describe("Email Validation", () => {
    test("valid with correct email address", () => {
      const email: string = "test@example.com";
      const result: ISignUpForm = UtilsSign.validateEmail(signForm, email);
      expect(result.isEmailValid).toBeTruthy();
      expect(result.emailError).toBe("");
    });

    test("invalid if email is empty", () => {
      const email: string = "";
      const result: ISignUpForm = UtilsSign.validateEmail(signForm, email);
      expect(result.isEmailValid).toBeFalsy();
      expect(result.emailError).toBe("L'email est obligatoire");
    });

    test("invalide avec une adresse email incorrecte", () => {
      const email: string = "test";
      const result: ISignUpForm = UtilsSign.validateEmail(signForm, email);
      expect(result.isEmailValid).toBeFalsy();
      expect(result.emailError).toBe("L'addresse email est incorrecte");
    });

    test("invalid if the email exceeds 90 characters", () => {
      const email: string = "a".repeat(91) + "@example.com";
      const result: ISignUpForm = UtilsSign.validateEmail(signForm, email);
      expect(result.isEmailValid).toBeFalsy();
      expect(result.emailError).toBe("Caractère maximum autorisé : 90");
    });

    test("invalid if the email is less than 7 characters", () => {
      const email: string = "a@b.co";
      const result: ISignUpForm = UtilsSign.validateEmail(signForm, email);
      expect(result.isEmailValid).toBeFalsy();
      expect(result.emailError).toBe("Caractère minimum autorisé : 7");
    });
  });

  describe("Name Validation", () => {
    test("valid with correct name", () => {
      const name: string = "Robin Mazouni";
      const result: ISignUpForm = UtilsSign.validateName(signForm, name);
      expect(result.isFullNameValid).toBeTruthy();
      expect(result.fullNameError).toBe("");
    });

    test("invalid if name was empty", () => {
      const name: string = "";
      const result: ISignUpForm = UtilsSign.validateName(signForm, name);
      expect(result.isFullNameValid).toBeFalsy();
      expect(result.fullNameError).toBe("Prénom nom est obligatoire");
    });

    test("invalid if the name exceeds 39 characters ", () => {
      const name: string = "e".repeat(40);
      const result: ISignUpForm = UtilsSign.validateName(signForm, name);
      expect(result.isFullNameValid).toBeFalsy();
      expect(result.fullNameError).toBe("Caractère maximun autorisé : 39");
    });

    test("invalid if the name is less than 8 characters", () => {
      const name: string = "e";
      const result: ISignUpForm = UtilsSign.validateName(signForm, name);
      expect(result.isFullNameValid).toBeFalsy();
      expect(result.fullNameError).toBe("Caractère minimum autorisé : 8");
    });

    test("invalid if the name is contain wrong characters", () => {
      const name: string = "e11|#)(/_?&gjhgj";
      const result: ISignUpForm = UtilsSign.validateName(signForm, name);
      expect(result.isFullNameValid).toBeFalsy();
      expect(result.fullNameError).toBe(
        "Caractère autorisé : lettres, accents, et tirets autorisés."
      );
    });
  });

  describe("Phone Validation", () => {
    test("valid with correct phone", () => {
      const phone: string = "0630359002";
      const result: ISignUpForm = UtilsSign.validatePhone(signForm, phone);
      expect(result.isPhoneValid).toBeTruthy();
      expect(result.phoneError).toBe("");
    });

    test("invalid if the phone is empty", () => {
      const phone: string = "";
      const result: ISignUpForm = UtilsSign.validatePhone(signForm, phone);
      expect(result.isPhoneValid).toBeFalsy();
      expect(result.phoneError).toBe("Le numéro de téléphone est obligatoire.");
    });

    test("invalid if the phone contain other than numbers", () => {
      const phone: string = "numéro1234";
      const result: ISignUpForm = UtilsSign.validatePhone(signForm, phone);
      expect(result.isPhoneValid).toBeFalsy();
      expect(result.phoneError).toBe(
        "Le numéro ne doit contenir que des chiffres "
      );
    });

    test("invalid if phone length is not 10", () => {
      const phone: string = "12345";
      const result: ISignUpForm = UtilsSign.validatePhone(signForm, phone);
      expect(result.isPhoneValid).toBeFalsy();
      expect(result.phoneError).toBe(
        "Le numéro doit contenir entre 10 chiffres"
      );
    });
  });

  describe("Password Validation", () => {
    test("valid with correct password", () => {
      const password: string = "ValidPass1-";
      const result: ISignUpForm = UtilsSign.validatePassword(
        signForm,
        password
      );
      expect(result.isPasswordValid).toBeTruthy();
      expect(result.passwordError).toBe("");
    });

    test("invalid if password is empty", () => {
      const password: string = "";
      const result: ISignUpForm = UtilsSign.validatePassword(
        signForm,
        password
      );
      expect(result.isPasswordValid).toBeFalsy();
      expect(result.passwordError).toBe("Le mot de passe est obligatoire.");
    });

    test("invalid if password is incorrect syntax", () => {
      const password: string = "test";
      const result: ISignUpForm = UtilsSign.validatePassword(
        signForm,
        password
      );
      expect(result.isPasswordValid).toBeFalsy();
      expect(result.passwordError).toBe(
        "Le mot de passe doit contenir 8-20 caractères avec au moins un chiffre, une majuscule et un symbole."
      );
    });
  });

  describe("Confirm Password Validation", () => {
    test("valid with correct confirm password", () => {
      signForm.password = "Password1-0";
      const confirmPassword: string = "Password1-0";
      const result: ISignUpForm = UtilsSign.validateConfirmPassword(
        signForm,
        confirmPassword
      );
      expect(result.isConfirmPasswordValid).toBeTruthy();
      expect(result.confirmPasswordError).toBe("");
    });

    test("invalid if confirm password is not the same of password", () => {
      signForm.confirmPassword = "Pard1-0";
      const confirmPassword: string = "Password1-0";
      const result: ISignUpForm = UtilsSign.validateConfirmPassword(
        signForm,
        confirmPassword
      );
      expect(result.isConfirmPasswordValid).toBeFalsy();
      expect(result.confirmPasswordError).toBe(
        "La confirmation du mot de passe est différent"
      );
    });

    test("invalid if confirm password is empty", () => {
      const confirmPassword: string = "";
      const result: ISignUpForm = UtilsSign.validateConfirmPassword(
        signForm,
        confirmPassword
      );
      expect(result.isConfirmPasswordValid).toBeFalsy();
      expect(result.confirmPasswordError).toBe(
        "La confirmation du mot de passe est obligatoire"
      );
    });
  });

  describe("Hut Name Validation", () => {
    test("valid with correct hut name", () => {
      signForm.isOwner = true;
      const hutName: string = "Hachette";
      const result: ISignUpForm = UtilsSign.validateHutName(signForm, hutName);
      expect(result.isHutNameValid).toBeTruthy();
      expect(result.hutNameError).toBe("");
      expect(result.hutName).toBe(hutName);
    });

    test("invalid if the name exceeds 35 characters", () => {
      signForm.isOwner = true;
      const hutName: string = "H".repeat(40);
      const result: ISignUpForm = UtilsSign.validateHutName(signForm, hutName);
      expect(result.isHutNameValid).toBeFalsy();
      expect(result.hutNameError).toBe("Caractère maximum autorisé : 35");
      expect(result.hutName).toBe(hutName);
    });
    test("invalid if the name is less than 5 characters", () => {
      signForm.isOwner = true;
      const hutName: string = "H";
      const result: ISignUpForm = UtilsSign.validateHutName(signForm, hutName);
      expect(result.isHutNameValid).toBeFalsy();
      expect(result.hutNameError).toBe("Caractère minimum autorisé : 5");
      expect(result.hutName).toBe(hutName);
    });
  });

  describe("Hut Number Validtion", () => {
    test("Valid with correct Hut Number", () => {
      signForm.isOwner = true;
      const hutNumber: string = "123456";
      const result: ISignUpForm = UtilsSign.validateHutNumber(
        signForm,
        hutNumber
      );
      expect(result.hutNumber).toBe(hutNumber);
      expect(result.isHutNumberValid).toBeTruthy();
      expect(result.hutNumberError).toBe("");
    });

    test("Invalid if Hut Number have wrong character", () => {
      signForm.isOwner = true;
      const hutNumber: string = "test";
      const result: ISignUpForm = UtilsSign.validateHutNumber(
        signForm,
        hutNumber
      );
      expect(result.hutNumber).toBe(hutNumber);
      expect(result.isHutNumberValid).toBeFalsy();
      expect(result.hutNumberError).toBe(
        "Le numéro de la hute contient seulement des chiffres"
      );
    });

    test("Invalid if Hut Number is empty", () => {
      signForm.isOwner = true;
      const hutNumber: string = "";
      const result: ISignUpForm = UtilsSign.validateHutNumber(
        signForm,
        hutNumber
      );
      expect(result.hutNumber).toBe(hutNumber);
      expect(result.isHutNumberValid).toBeFalsy();
      expect(result.hutNumberError).toBe(
        "Le numéro de la hutte est obligatoire"
      );
    });

    test("invalid if the name exceeds 35 characters", () => {
      signForm.isOwner = true;
      const hutNumber: string = "1".repeat(36);
      const result: ISignUpForm = UtilsSign.validateHutNumber(
        signForm,
        hutNumber
      );
      expect(result.hutNumber).toBe(hutNumber);
      expect(result.isHutNumberValid).toBeFalsy();
      expect(result.hutNumberError).toBe("Caractère maximum autorisé : 35");
    });
    test("invalid if the name is less than 5 characters", () => {
      signForm.isOwner = true;
      const hutNumber: string = "123";
      const result: ISignUpForm = UtilsSign.validateHutNumber(
        signForm,
        hutNumber
      );
      expect(result.hutNumber).toBe(hutNumber);
      expect(result.isHutNumberValid).toBeFalsy();
      expect(result.hutNumberError).toBe("Caractère minimum autorisé : 5");
    });
  });
});
