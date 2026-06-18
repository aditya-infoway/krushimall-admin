import { NavigationTree } from "@/@types/navigation";

export const usermaster: NavigationTree = {
 id: "usermaster",
 type: "root",
 title: "User Master",
 icon: "user",
 childs: [
  {
   id: "account",
   type: "item",
   title: "Create Account",
   path: "/usermaster/account",
   icon: "account",
  },
  {
   id: "employee",
   type: "item",
   title: "Create Employee",
   path: "/usermaster/employee",
   icon: "employee",
  },
  {
   id: "createbroker",
   type: "item",
   title: "Create Broker",
   path: "/usermaster/createbroker",
   icon: "broker",
  },
 ],
};