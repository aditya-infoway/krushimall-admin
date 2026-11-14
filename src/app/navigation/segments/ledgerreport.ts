import { NavigationTree } from "@/@types/navigation";

export const ledgerreport: NavigationTree = {
  id: "ledgerreport",
  type: "root",
  title: "Ledger Report",
  icon: "ledgerreport",
   path: "/ledgerdetails", 
  childs: [
   
    {
      id: "ledgerreport",
      type: "item",
      title: "Ledger Report",
      path: "/ledgerdetails/ledgerreport",
      
    },
  ],
};