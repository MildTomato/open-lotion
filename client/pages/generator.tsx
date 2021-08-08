import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
const GeneratePDF = dynamic(() => import("../components/GeneratePDF"), {
  ssr: false,
});
const app = () => {
  const ref: any = React.useRef();

  return (
    <div className="main">
      <div className="content" ref={ref}>
        <h1>Hello PDF</h1>
        <img
          id="image"
          src="/images/image_header.jpeg"
          width="300"
          height="200"
        />
        <h1>Hello world</h1>
        <p id="text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam
          animi, molestiae quaerat assumenda neque culpa ab aliquam facilis eos
          nesciunt! Voluptatibus eligendi vero amet dolorem omnis provident
          beatae nihil earum! Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Ea, est. Magni animi fugit voluptates mollitia
          officia libero in. Voluptatibus nisi assumenda accusamus deserunt sunt
          quidem in, ab perspiciatis ad rem. Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Nihil accusantium reprehenderit, quasi
          dolorum deserunt, nisi dolores quae officiis odio vel natus! Pariatur
          enim culpa velit consequatur sapiente natus dicta alias! Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Consequatur, asperiores
          error laudantium corporis sunt earum incidunt expedita quo quidem
          delectus fugiat facilis quia impedit sit magni quibusdam ipsam
          reiciendis quaerat!
        </p>
        <p id="text2" className="text-red-400">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam
          animi, molestiae quaerat assumenda neque culpa ab aliquam facilis eos
          nesciunt! Voluptatibus eligendi vero amet dolorem omnis provident
          beatae nihil earum! Lorem, ipsum dolor sit amet consectetur
          adipisicing eladsdasdasdasds ddadsaiu dasiub uasduias duas quia
          impedit sit magni quibusdam ipsam reiciendis quaerat!
        </p>
      </div>
      <GeneratePDF html={ref} />
    </div>
  );
};

export default app;
