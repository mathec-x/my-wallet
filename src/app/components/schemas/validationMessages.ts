
const validationMessages = {
  minLength: 'Mínimo {min} caracteres',
  maxLength: 'Máximo {max} caracteres',
  required: 'Campo obrigatório',
  invalidEmail: 'Email inválido',
  passwordsDoNotMatch: 'As senhas não coincidem'
};

export const validationMessage = (key: keyof typeof validationMessages, params?: Record<string, string | number>) => {
  let message = validationMessages[key] || '';
  if (params) {
    Object.keys(params).forEach(paramKey => {
      const regex = new RegExp(`{${paramKey}}`, 'g');
      message = message.replace(regex, String(params[paramKey]));
    });
  }
  return message;
};

export default validationMessages;