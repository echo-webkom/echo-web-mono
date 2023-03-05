import {type NextPage} from "next";
import {Layout} from "@/components";

const HomePage: NextPage = () => {
  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold">Hello world!</h1>
      </div>
    </Layout>
  );
};

export default HomePage;
