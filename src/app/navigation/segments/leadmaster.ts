import { NavigationTree } from "@/@types/navigation";

export const leadmaster: NavigationTree = {
 id: "leadmaster",
 type: "root",
 title: "Lead Master",
 icon: "master",
 childs: [
  {
   id: "leadbuilder",
   type: "item",
   title: "Lead Builder Report",
   path: "/leadmaster/leadbuilder",
   icon: "leadbuilder",
  },
 
 ],
};