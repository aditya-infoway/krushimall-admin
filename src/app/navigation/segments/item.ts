import { NavigationTree } from "@/@types/navigation";

export const item: NavigationTree = {
  id: "item",
  type: "root",
  title: "Item Data",
  icon: "item",
  childs: [
    {
      id: "tractor",
      type: "item",
      title: "Tractor Item",
      path: "/item/tractor",
      icon: "tractor",
    },
    {
      id: "accessories",
      type: "item",
      title: "Accessories",
      path: "/item/accessories",
      icon: "accessories",
    },
  ],
};