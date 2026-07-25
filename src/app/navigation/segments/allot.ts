import { NavigationTree } from "@/@types/navigation";

export const allot: NavigationTree = {
  id: "allot",
  type: "root",
  title: "Allot",
  icon: "cashbank",
  childs: [
    {
      id: "allot",
      type: "item",
      title: "Vehicle Incharge",
      path: "/allot/vehicleIncharge",
      
    },
    {
      id: "allot",
      type: "item",
      title: "Accessories Allot",
      path: "/allot/accessoriesAllot",
      
    },
     {
      id: "allot",
      type: "item",
      title: "Vehicle Verify Accessories",
      path: "/allot/vehicle_verify_accessories",
      
    },
  ],
};
