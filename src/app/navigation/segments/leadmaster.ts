import { NavigationTree } from "@/@types/navigation";

export const leadmaster: NavigationTree = {
  id: "leadmaster",
  type: "root",
  title: "Lead Master",
  icon: "leadbuilder",
  path: "/leadmaster",
  childs: [
    {
      id: "leadbuilder",
      type: "item",
      title: "Lead Builder Report",
      path: "/leadmaster/leadbuilder",
    },
    {
      id: "Quatationhistory",
      type: "item",
      title: "Quotation History",
      path: "/leadmaster/Quatationhistory",
    },

    {
      id: "Testdrivehistory",
      type: "item",
      title: "Testdrive History",
      path: "/leadmaster/testdrivehistory",
    },

    { id: "divider-implement", type: "divider" },
    // Goods Control Master section
    {
      id: "implement-label",
      type: "title",
      title: "Implement",
    },

    {
      id: "implementcategory",
      type: "item",
      title: "Category",
      path: "/implement/implementcategory",
    },
    {
      id: "implementbrand",
      type: "item",
      title: "Brand",
      path: "/implement/implementbrand",
    },
    {
      id: "implementmodel",
      type: "item",
      title: "Model",
      path: "/implement/implementmodel",
    },
    {
      id: "implementvariant",
      type: "item",
      title: "Variant",
      path: "/implement/implementvariant",
    },
    {
      id: "implementcolour",
      type: "item",
      title: "Colour",
      path: "/implement/implementcolour",
    },
     {
      id: "createimplement",
      type: "item",
      title: "Create Implement",
      path: "/implement/createimplement",
    },
  ],
};
