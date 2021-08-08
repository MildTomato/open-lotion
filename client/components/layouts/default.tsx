import React from "react";
import Nav from "./../Nav";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

export default function DefaultLayout(props: Props) {
  const { children } = props;
  return (
    <>
      <Nav />
      <main>{children}</main>
      {/* <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </>
  );
}
