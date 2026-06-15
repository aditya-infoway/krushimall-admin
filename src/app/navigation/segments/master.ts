import { NavigationTree } from "@/@types/navigation";

export const master: NavigationTree = {
 id: "master",
 type: "root",
 title: "Master Data",
 icon: "master",
 childs: [
  {
   id: "category",
   type: "item",
   title: "Category",
   path: "/master/category",
   icon: "category",
  },
  {
   id: "brand",
   type: "item",
   title: "Brand",
   path: "/master/brand",
   icon: "brand",
  },
  {
   id: "model",
   type: "item",
   title: "Model",
   path: "/master/model",
   icon: "model",
  },
  {
   id: "year",
   type: "item",
   title: "Year",
   path: "/master/year",
   icon: "year",
  },
  {
   id: "variant",
   type: "item",
   title: "Variant",
   path: "/master/variant",
   icon: "variant",
  },
 ],
};