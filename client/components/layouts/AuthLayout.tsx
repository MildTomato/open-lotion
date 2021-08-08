import React from "react";

import logo from "./../../public/images/logo.png";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout(props: AuthLayoutProps) {
  const { children } = props;

  return (
    <div className="w-80 mx-auto my-8 lg:my-32">
      <div className="mb-8">
        <Image src={logo} alt="logo" width={32} height={32} />
      </div>
      {children}
    </div>
  );
}
