import { NavigationTree } from "@/@types/navigation";

export const stocktransfer: NavigationTree = {
  id: "stocktransfer",
  type: "root",
  title: "Stock Transfer",
  icon: "stocktransfer",
  childs: [
    {
      id: "vehiclestock",
      type: "item",
      title: "VehiceStock Transfer",
      path: "/stocktransfer/vehiclestock",
      
    },
   
  ],
};