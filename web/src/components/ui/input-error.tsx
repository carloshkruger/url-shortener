type InputErrorProps = {
  message?: string;
};

export function InputError({ message }: InputErrorProps) {
  if (!message) {
    return null;
  }

  return <span className="text-red-500 text-sm">{message}</span>;
}
