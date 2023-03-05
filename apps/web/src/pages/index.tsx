import {type NextPage} from "next";
import {Layout} from "@/components";

const HomePage: NextPage = () => {
  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="font-mono text-5xl">Velkommen til echo</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa,
          commodi.
        </p>
      </div>
    </Layout>
  );
};

export default HomePage;
