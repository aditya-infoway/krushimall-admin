import {
  HomeIcon,
  UserIcon as HiUserIcon,
  FolderIcon,
  TagIcon,
  CubeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  BriefcaseIcon,
  UserCircleIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  
} from "@heroicons/react/24/outline";
import { ElementType } from "react";
import { 
  TbCategory, 
  TbSourceCode, 
  TbBriefcase, 
  TbBuildingBank, 
  TbCoin,
  TbPalette, 
  TbColorSwatch, 
  TbBrush
  
} from "react-icons/tb";

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
  color: TbPalette,
  variant: CubeIcon,
  showroom: BuildingOfficeIcon,
  leadbuilder: ChartBarIcon,
  account: BuildingOfficeIcon,
  employee: HiUserIcon,
  broker: BriefcaseIcon,
   enquirysettings: TbCategory,
  enquirytype: DocumentTextIcon, 
  enquirysource: TbSourceCode, 
  profession: UserCircleIcon, 
  banker: HomeIcon, 
  finance: TbCoin, 
enquirystatus: CheckCircleIcon,
};
