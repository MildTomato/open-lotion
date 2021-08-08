import Image from "next/image";
import logo from "./../public/images/logo.png";

export default function Nav() {
  return (
    <nav className="flex p-3 lg:p-6 space-x-8">
      <div className="space-x-3 items-center flex">
        <Image src={logo} alt="logo" width={32} height={32} />
        {/* <span className="text-sm">Openotes</span> */}
      </div>
      <ol className="flex space-x-3 items-center">
        {/* <li className="text-sm">Browse</li>
        <li className="text-sm">Create</li> */}
      </ol>
    </nav>
  );
}
