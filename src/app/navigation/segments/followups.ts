import { NavigationTree } from "@/@types/navigation";

export const followups: NavigationTree = {
  id: "followups",
  type: "root",
  title: "FollowUps",
   path: "/followups", 
  icon: "follow",
  childs: [
    {
      id: "todayfollowups",
      type: "item",
      title: "Today Followups",
      path: "followups/todayfollowups",
    },
  ],
};
