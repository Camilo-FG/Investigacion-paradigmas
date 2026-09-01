export function validatePassword(password: string): string | null {
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  if (!/[a-zA-Z]/.test(password)) return 'La contraseña debe contener al menos una letra';
  if (!/[0-9]/.test(password)) return 'La contraseña debe contener al menos un número';
  return null;
}
