import { NavigationTree } from "@/@types/navigation";

export const accounting: NavigationTree = {
  id: "accounting",
  type: "root",
  title: "Accounting",
  icon: "accounting",
  childs: [
    {
      id: "debit-note",
      type: "item",
      title: "Debit Note",
      path: "/accounting/debit-note",
      icon: "debitnote",
    },
    {
      id: "credit-note",
      type: "item",
      title: "Credit Note",
      path: "/accounting/credit-note",
      icon: "creditnote",
    },
    {
      id: "cash-payment",
      type: "item",
      title: "Cash Payment",
      path: "/accounting/cash-payment",
      icon: "cashpayment",
    },
    {
      id: "cash-receipt",
      type: "item",
      title: "Cash Receipt",
      path: "/accounting/cash-receipt",
      icon: "cashreceipt",
    },
    {
      id: "bank-payment",
      type: "item",
      title: "Bank Payment",
      path: "/accounting/bank-payment",
      icon: "bankpayment",
    },
    {
      id: "bank-receipt",
      type: "item",
      title: "Bank Receipt",
      path: "/accounting/bank-receipt",
      icon: "bankreceipt",
    },
    {
      id: "contra",
      type: "item",
      title: "Contra",
      path: "/accounting/contra",
      icon: "contra",
    },
    {
      id: "journal-entries",
      type: "item",
      title: "Journal Entries",
      path: "/accounting/journal-entries",
      icon: "journal",
    },
  ],
};