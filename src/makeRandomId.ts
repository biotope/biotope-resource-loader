const makeRandomId = (length: number = 8): string => {
  let text = '';
  const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
  }
  return text;
};

export default makeRandomId;
