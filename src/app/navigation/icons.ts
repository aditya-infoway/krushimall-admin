import { TbPalette } from "react-icons/tb";
import { HomeIcon, UserIcon as HiUserIcon,FolderIcon,TagIcon,CubeIcon,CalendarIcon, BuildingOfficeIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { ElementType } from "react";

import DashboardsIcon from "@/assets/dualicons/dashboards.svg?react";
import SettingIcon from "@/assets/dualicons/setting.svg?react";

export const navigationIcons: Record<string, ElementType> = {
  dashboards: DashboardsIcon,
  settings: SettingIcon,
  "dashboards.home": HomeIcon,
  "settings.general": HiUserIcon,
  "settings.appearance": TbPalette,
  master: FolderIcon,
 category: FolderIcon,
 brand: TagIcon,
 model: CubeIcon,
 year: CalendarIcon,
 variant: CubeIcon,
 showroom: BuildingOfficeIcon,
 leadbuilder: ChartBarIcon,
};
