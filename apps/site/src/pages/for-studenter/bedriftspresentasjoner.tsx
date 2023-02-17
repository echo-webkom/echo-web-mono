import { groq } from "next-sanity";
import React, { useEffect } from "react";
import SanityAPI from "../../lib/api/sanity";

const Bedriftspresentasjoner = () => {
  useEffect(() => {
    const test = async () => {
      const query = groq`
                *[_type == "happening" && !(_id in path('drafts.**'))]
            `;
      const result = await SanityAPI.fetch(query);
      console.log(result);
    };

    void test();
  }, []);

  return <div>Bedriftspresentasjoner</div>;
};

export default Bedriftspresentasjoner;
