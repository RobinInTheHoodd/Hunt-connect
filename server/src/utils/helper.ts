export function generateUniqueNumberID() {
  const timePart = new Date().getTime(); // Nombre de millisecondes depuis le 1er janvier 1970
  const randomPart = Math.floor(Math.random() * 1000000); // Un nombre aléatoire entre 0 et 999999
  return Number(`${timePart}${randomPart}`);
}
