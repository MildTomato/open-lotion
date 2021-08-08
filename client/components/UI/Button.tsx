// import React from "react";

// interface Props extends React.HTMLProps<HTMLButtonElement> {
//   //   children: React.ReactNode;
// }

// export default function Input(props: Props) {
//   return (
//     <button
//       {...props}
//       className="
//       bg-gray-50
//       py-1.5 px-3 shadow-sm border rounded text-base w-full
//       "
//     >
//       {children}
//     </button>
//   );
// }

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button {...props} className="bg-black shadow-sm rounded text-white py-2">
      <span className="shadow-inner">{children}</span>
      {/* {showIcon && <Icon />} */}
    </button>
  );
}
