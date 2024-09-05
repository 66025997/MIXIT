import createClient from "@/utils/supabase/api";

export default async function handler(req, res) {
  const supabase = createClient(req, res);

  switch (req.method) {
    case "GET":
      try {
        const { data, error } = await supabase
          .from("followers")
          .select("user:follower_id (*)")
          .eq("user_id", req.query.id);

        if (!data)
          return res.status(404).json({
            message: `No user found or unable to retrieve data.`,
            error,
          });
        if (error)
          return res.status(500).json({
            message: "An error occurred while retrieving data.",
            error,
          });

        return res.status(200).json(data.flatMap(({ user }) => user));
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Internal server error", error });
      }
    default:
      return res
        .status(405)
        .appendHeader("Allow", "GET")
        .end(`Method ${req.method} Not Allowed`);
  }
}
