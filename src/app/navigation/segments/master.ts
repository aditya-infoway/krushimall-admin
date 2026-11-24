import { NavigationTree } from "@/@types/navigation";

export const master: NavigationTree = {
  id: "master",
  type: "root",
  title: "Master Data",
  icon: "master",
  path: "/master",
  childs: [
    {
      id: "category",
      type: "item",
      title: "Category",
      path: "/master/category",
    },
    {
      id: "brand",
      type: "item",
      title: "Brand",
      path: "/master/brand",
    },
    {
      id: "model",
      type: "item",
      title: "Model",
      path: "/master/model",
    },
    {
      id: "year",
      type: "item",
      title: "Year",
      path: "/master/year",
    },
    {
      id: "color",
      type: "item",
      title: "Colour",
      path: "/master/color",
    },

    // Dropdown
    {
      id: "variant",
      type: "collapse",
      title: "Variant",
      path: "/master/variant",
      icon: "variant",
      childs: [
        {
          id: "createvariant",
          type: "item",
          title: "Create Variant",
          path: "/master/variant/create",
        },
        {
          id: "websitevariant",
          type: "item",
          title: "Website Variant",
          path: "/master/variant/website",
        },
        {
          id: "showroomvariant",
          type: "item",
          title: "Showroom Variant",
          path: "/master/variant/showroom",
        },
      ],
    },

    { id: "divider-usermaster", type: "divider" },
    {
      id: "usermaster-label",
      type: "title",
      title: "User Master",
    },

    {
      id: "account",
      type: "item",
      title: "Create Account",
      path: "/usermaster/account",
    },
    {
      id: "employee",
      type: "item",
      title: "Create Employee",
      path: "/usermaster/employee",
    },
    {
      id: "createbroker",
      type: "item",
      title: "Create Broker",
      path: "/usermaster/createbroker",
    },
    {
      id: "branch",
      type: "item",
      title: "Create Branch",
      path: "/usermaster/branch",
    },

    { id: "divider-usermaster", type: "divider" },

    // Enquiry Master section
    {
      id: "enquirymaster-label",
      type: "title",
      title: "Enquiry Master",
    },
    {
      id: "enquirytype",
      type: "item",
      title: "Enquiry Type",
      path: "/enquirysettings/enquirytype",
    },
    {
      id: "enquirysource",
      type: "item",
      title: "Enquiry Source",
      path: "/enquirysettings/enquirysource",
    },
    {
      id: "profession",
      type: "item",
      title: "Profession",
      path: "/enquirysettings/profession",
    },
    {
      id: "banker",
      type: "item",
      title: "Banker",
      path: "/enquirysettings/banker",
    },
    {
      id: "finance",
      type: "item",
      title: "Finance",
      path: "/enquirysettings/finance",
    },
    {
      id: "enquirystatus",
      type: "item",
      title: "Enquiry Status",
      path: "/enquirysettings/enquirystatus",
    },

    { id: "divider-usermaster", type: "divider" },

    {
      id: "itemmaster-label",
      type: "title",
      title: "Item Master",
    },
    {
      id: "tractor",
      type: "item",
      title: "Tractor Item",
      path: "/item/tractor",
    },
    {
      id: "accessories",
      type: "item",
      title: "Accessories",
      path: "/item/accessories",
    },

    {
      id: "spareparts",
      type: "item",
      title: "Spare Parts",
      path: "/item/sparepart",
    },

    { id: "divider-usermaster", type: "divider" },
    // Goods Control Master section
    {
      id: "goodscontrol-label",
      type: "title",
      title: "Goods Control Master",
    },
    {
      id: "tractorinventory",
      type: "item",
      title: "Tractor Inventory",
      path: "/goodscontrol/tractorinventory",
    },
    {
      id: "accessoriesinventory",
      type: "item",
      title: "Accessories Inventory",
      path: "/goodscontrol/accessoriesinventory",
    },
  ],
};
