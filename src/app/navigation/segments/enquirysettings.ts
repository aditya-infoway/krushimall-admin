import { NavigationTree } from "@/@types/navigation";

export const enquirysettings: NavigationTree = {
 id: "enquirysettings",
 type: "root",
 title: "Enquiry Settings",
 icon: "settings",
 childs: [
  {
   id: "enquirytype",
   type: "item",
   title: "Enquiry Type",
   path: "/enquirysettings/enquirytype",
   icon: "enquirytype",
  },
  {
   id: "enquirysource",
   type: "item",
   title: "Enquiry Source",
   path: "/enquirysettings/enquirysource",
   icon: "enquirysource",
  },
  {
   id: "profession",
   type: "item",
   title: "Profession",
   path: "/enquirysettings/profession",
   icon: "profession",
  },
  {
   id: "banker",
   type: "item",
   title: "Banker",
   path: "/enquirysettings/banker",
   icon: "banker",
  },
  {
   id: "finance",
   type: "item",
   title: "Finance",
   path: "/enquirysettings/finance",
   icon: "finance",
  },
    {
   id: "enquirystatus",
   type: "item",
   title: "Enquiry Status",
   path: "/enquirysettings/enquirystatus",
   icon: "enquirystatus",
  },
 ],
};