import { NavigationTree } from "@/@types/navigation";

export const bookregister: NavigationTree = {
  id: "bookregister",
  type: "root",
  title: "Cash/Bank Register",
  icon: "cashbank",
  childs: [
    {
      id: "bookregister",
      type: "item",
      title: "Cash Book",
      path: "/bookregister/cashbook",
      
    },
    {
      id: "bookregister",
      type: "item",
      title: "Bank Book",
      path: "/bookregister/bankbook",
      
    },
  ],
};
//  {
//       id: "cash-bank",
//       type: "collapse",
//       title: "Cash/Bank Register",
//       path: "/accounting/cash-bank",
//       icon: "cashbank",
//       childs: [
//         {
//           id: "cashbook",
//           type: "item",
//           title: "Cash Book",
//           path: "/accounting/cash-bank/cashbook",
//         },
//         {
//           id: "bankbook",
//           type: "item",
//           title: "Bank Book",
//           path: "/accounting/cash-bank/bankbook",
//         },
//       ],
//     },