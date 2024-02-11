// utils.ts

export class UtilsSign {
  // Méthode statique pour la validation d'email
  static validateEmail(email: string): boolean {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  static validatePassword(password: string): boolean {
    const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,20}$/;
    return regex.test(password);
  }
}
