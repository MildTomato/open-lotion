interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {}

export default function Input(props: Props) {
  return (
    <input
      {...props}
      className="
      bg-gray-100
      py-1.5 px-3 shadow-sm border rounded text-base w-full
      
      "
    />
  );
}
