export type InputVariant = 'outline' | 'underline' | 'none';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  label?: string;
  error?: string;
  variant?: InputVariant;
  maxCount?: number;
}
