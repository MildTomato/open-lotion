// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../utils/supabaseClient";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  async function save() {
    console.log("save()");
    try {
      // const { data, error } = await supabase
      //   .from("pages")
      //   .insert([{ name: "blocks" }]);

      const { data, error } = await supabase.from("pages").insert({
        name: "john smith",
      });

      if (error) throw error;

      console.log("data", data);
      res.status(200).json();
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
  save();
}
