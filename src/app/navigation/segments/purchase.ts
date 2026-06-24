import { NavigationTree } from "@/@types/navigation";

export const purchase: NavigationTree = {
  id: "purchase",
  type: "root",
  title: "Purchase",
  icon: "purchase",
  childs: [
    {
      id: "purchase-tractor",
      type: "item",
      title: "Tractor Purchase",
      path: "/purchase/tractor",
   
    },
    {
      id: "purchase-accessories",
      type: "item",
      title: "Accessories Purchase",
      path: "/purchase/accessories",
     
    },
  ],
};