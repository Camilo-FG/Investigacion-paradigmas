export function ErrorMessage({ message }: { message: string }) {
  return <div className="alert alert-error">{message}</div>;
}
