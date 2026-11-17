import { dashboards } from "./segments/dashboards";
import { master } from "./segments/master";
import { leadmaster } from "./segments/leadmaster";
import { usermaster } from "./segments/usermaster";
import { enquirysettings } from "./segments/enquirysettings";
import { item } from "./segments/item";
import { purchase } from "./segments/purchase";
import { accounting } from "./segments/accounting";
import { goodcontrol } from "./segments/goodscontrol";
import { report } from "./segments/report";
import { followups } from "./segments/followups";
import { bookregister } from "./segments/bookregister";
// import { ledgerreport } from "./segments/ledgerreport";

import { stocktransfer } from "./segments/stocktransfer";
import { allot } from "./segments/allot";
import { logout } from "./segments/logout";
export const navigation = [
  dashboards,
  master,
  leadmaster,
  usermaster,
  enquirysettings,
  item,
  purchase,
  stocktransfer,
  accounting,
  bookregister,
  // ledgerreport,
  goodcontrol,
  allot,
  report,
  followups,
   logout,
];
