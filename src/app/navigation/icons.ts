import { TbPalette } from "react-icons/tb";
import {
  HomeIcon,
  UserIcon as HiUserIcon,
  FolderIcon,
  CubeIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  WalletIcon,
  ArchiveBoxIcon,
  UsersIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
  BookOpenIcon,
  BanknotesIcon,
  TruckIcon,
  Squares2X2Icon,
  PhoneArrowUpRightIcon,
  // Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { ElementType } from "react";

import DashboardsIcon from "@/assets/dualicons/dashboards.svg?react";
import SettingIcon from "@/assets/dualicons/setting.svg?react";

export const navigationIcons: Record<string, ElementType> = {
  dashboards: DashboardsIcon,
  "dashboards.home": HomeIcon,

  user: BriefcaseIcon,
  master: FolderIcon,
  variant: CubeIcon,
  item: ClipboardDocumentListIcon,
  accessories: WrenchScrewdriverIcon,

  leadmaster: ChartBarIcon,
  leadbuilder: ChartBarIcon,
  usermaster: UsersIcon,
  enquirysettings: Squares2X2Icon,

  purchase: ShoppingCartIcon,
  "purchase-tractor": TruckIcon,
  "purchase-accessories": WrenchScrewdriverIcon,

  stocktransfer: ArrowsRightLeftIcon,

  accounting: BuildingLibraryIcon,
  cashbank: WalletIcon,

  bookregister: BookOpenIcon,
  ledgerreport: BookOpenIcon,
  bookingbalance: BanknotesIcon,

  control: ArchiveBoxIcon,
  goodcontrol: ArchiveBoxIcon,
  goodscontrol: ArchiveBoxIcon,

  allot: TruckIcon,

  report: ExclamationTriangleIcon,

  follow: UserGroupIcon,
  followups: PhoneArrowUpRightIcon,

  settings: SettingIcon,
  "settings.general": HiUserIcon,
  "settings.appearance": TbPalette,
};