import { v4 as uuidv4 } from 'uuid';

export function generateTransactionCode(prefix: string = 'BIF'): string {
  const uuidPart = uuidv4().replace(/-/g, '').toUpperCase();

  
  return `${prefix}${uuidPart.slice(0, 16)}`;
}
