import { useEffect, useMemo, useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import {
  EyeIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import apiHelper from "@/utils/apiHelper";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/Table";

type Row = {
  key: string;
  model: string;
  variant: string;
  colour: string;
  byBranch: Record<number, any[]>;
};

// Vertical + horizontal lines har cell me
const cell = "border border-gray-300 dark:border-dark-500";

const eyeBtn = "text-primary-500 hover:text-primary-600 cursor-pointer";
const entriesOptions = [10, 20, 30, 40, 50, 100];
const BranchWiseInventory = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [modal, setModal] = useState<{ title: string; list: any[] } | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    (async () => {
      try {
        const b = await apiHelper.get("/branch");
        setBranches(Array.isArray(b) ? b : b?.data || []);

        const inv = await apiHelper.get(
          "/vehicle-stock-transfer/branch-wise-inventory",
        );
        setVehicles(inv?.data || []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // model + variant + colour ke hisaab se group
  const rows: Row[] = useMemo(() => {
    const map: Record<string, Row> = {};

    vehicles.forEach((v) => {
      const key = `${v.modelName}|${v.variantName}|${v.colour}`;
      if (!map[key]) {
        map[key] = {
          key,
          model: v.modelName || "-",
          variant: v.variantName || "-",
          colour: v.colour || "-",
          byBranch: {},
        };
      }
      const bid = Number(v.branchId);
      (map[key].byBranch[bid] ||= []).push(v);
    });

    return Object.values(map).sort(
      (a, b) =>
        a.model.localeCompare(b.model) || a.variant.localeCompare(b.variant),
    );
  }, [vehicles]);

  // Model column ka rowSpan (same model ki rows merge)
  // Search filter (model / variant / colour)
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.model.toLowerCase().includes(q) ||
        r.variant.toLowerCase().includes(q) ||
        r.colour.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const indexOfFirst = (currentPage - 1) * rowsPerPage;
  const indexOfLast = indexOfFirst + rowsPerPage;
  const pageRows = filteredRows.slice(indexOfFirst, indexOfLast);

  // Model rowSpan - sirf current page ki rows ke hisaab se
  const modelSpan = useMemo(() => {
    const span: Record<number, number> = {};
    let start = 0;
    pageRows.forEach((r, i) => {
      if (i === 0 || r.model !== pageRows[i - 1].model) {
        start = i;
        span[start] = 1;
      } else {
        span[start] += 1;
        span[i] = 0;
      }
    });
    return span;
  }, [pageRows]);

  // Grand total (filtered rows ka)
  const branchTotals = (bid: number) =>
    filteredRows.reduce((s, r) => s + (r.byBranch[bid]?.length || 0), 0);
  const grandTotal = filteredRows.reduce(
    (s, r) => s + Object.values(r.byBranch).flat().length,
    0,
  );

  return (
    <div className="min-h-screen bg-white p-6 dark:bg-gray-900">
      <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Branch Wise Inventory
        </h2>
      </div>
      <div className="relative mb-5 w-full max-w-md">
        <MagnifyingGlassIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search model, variant, colour..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="dark:border-dark-500 dark:bg-dark-800 w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm outline-none"
        />
      </div>
      <div className="hide-scrollbar dark:border-dark-500 min-w-full overflow-x-auto">
        <Table className="w-full border-collapse text-left">
          <THead>
            <Tr>
              <Th className={`${cell} bg-gray-100 text-center font-semibold`}>
                Sr No
              </Th>
              <Th className={`${cell} bg-gray-100 font-semibold`}>Model</Th>
              <Th className={`${cell} bg-gray-100 font-semibold`}>Variant</Th>
              <Th className={`${cell} bg-gray-100 font-semibold`}>Colour</Th>
              {branches.map((b) => (
                <Th
                  key={b.id}
                  className={`${cell} bg-gray-100 text-center font-semibold whitespace-nowrap`}
                >
                  {b.branchName}
                </Th>
              ))}
              <Th className={`${cell} bg-gray-100 text-center font-semibold`}>
                Total
              </Th>
            </Tr>
          </THead>

          <TBody>
            {pageRows.map((r, i) => {
              const all = Object.values(r.byBranch).flat();

              return (
                <Tr key={r.key}>
                  <Td className={`${cell} text-center`}>{i + 1}</Td>

                  {modelSpan[i] !== 0 && (
                    <Td
                      rowSpan={modelSpan[i]}
                      className={`${cell} align-middle font-medium`}
                    >
                      {r.model}
                    </Td>
                  )}

                  <Td className={`${cell} whitespace-nowrap`}>{r.variant}</Td>
                  <Td className={`${cell} whitespace-nowrap`}>{r.colour}</Td>

                  {branches.map((b) => {
                    const list = r.byBranch[b.id] || [];
                    return (
                      <Td key={b.id} className={`${cell} text-center`}>
                        {list.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            {list.length}
                            <button
                              type="button"
                              title="View stock"
                              className={eyeBtn}
                              onClick={() =>
                                setModal({
                                  title: `${b.branchName} - ${r.model} ${r.variant} ${r.colour}`,
                                  list,
                                })
                              }
                            >
                              <EyeIcon className="size-4" />
                            </button>
                          </span>
                        )}
                      </Td>
                    );
                  })}

                  {/* Row Total - saari branches ka */}
                  <Td className={`${cell} text-center font-semibold`}>
                    <span className="inline-flex items-center gap-1">
                      {all.length}
                      <button
                        type="button"
                        title="View all branches stock"
                        className={eyeBtn}
                        onClick={() =>
                          setModal({
                            title: `${r.model} ${r.variant} ${r.colour} - All Branches`,
                            list: all,
                          })
                        }
                      >
                        <EyeIcon className="size-4" />
                      </button>
                    </span>
                  </Td>
                </Tr>
              );
            })}

            {filteredRows.length > 0 && (
              <Tr className="dark:bg-dark-600 bg-gray-100 font-semibold">
                <Td colSpan={4} className={`${cell} text-right`}>
                  TOTAL
                </Td>
                {branches.map((b) => (
                  <Td key={b.id} className={`${cell} text-center`}>
                    {branchTotals(b.id)}
                  </Td>
                ))}
                <Td className={`${cell} text-center`}>{grandTotal}</Td>
              </Tr>
            )}

            {filteredRows.length === 0 && (
              <Tr>
                <Td
                  colSpan={5 + branches.length}
                  className={`${cell} py-10 text-center text-gray-400`}
                >
                  No transferred stock found
                </Td>
              </Tr>
            )}
          </TBody>
        </Table>
      </div>
      {totalItems > 0 && (
        <div className="dark:border-dark-700 dark:bg-dark-800 flex flex-col gap-4 border border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center">
          <div className="order-1 flex items-center justify-center gap-2 text-sm text-gray-600 md:w-1/3 md:justify-start dark:text-gray-400">
            <span>Show</span>
            <div className="w-20">
              <Menu as="div" className="relative inline-block w-full text-left">
                <MenuButton className="dark:border-dark-600 dark:bg-dark-700 flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:outline-none dark:text-gray-200">
                  <span>{rowsPerPage}</span>
                  <svg
                    className="ml-2 h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems
                    anchor="bottom start"
                    className="dark:bg-dark-700 dark:border-dark-600 z-[200] w-20 space-y-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-xl ring-1 ring-black/5 [--anchor-gap:6px] focus:outline-none"
                  >
                    {entriesOptions.map((n) => (
                      <MenuItem key={n}>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={() => {
                              setRowsPerPage(n);
                              setCurrentPage(1);
                            }}
                            className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium ${
                              n === rowsPerPage
                                ? "bg-primary-500 text-white"
                                : active
                                  ? "dark:bg-dark-600 bg-gray-100 text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {n}
                            {n === rowsPerPage && (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
            <span>entries</span>
          </div>

          <div className="order-2 flex justify-center md:w-1/3">
            <div className="dark:border-dark-700 dark:bg-dark-800 inline-flex items-center space-x-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400"
              >
                <ChevronLeftIcon className="size-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-primary-500 text-white"
                        : "dark:hover:bg-dark-700 text-gray-600 hover:bg-gray-100 dark:text-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="dark:hover:bg-dark-700 inline-flex size-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          </div>

          <div className="order-3 flex items-center justify-center text-sm text-gray-500 select-none md:w-1/3 md:justify-end dark:text-gray-400">
            {indexOfFirst + 1} - {Math.min(indexOfLast, totalItems)} of{" "}
            {totalItems} entries
          </div>
        </div>
      )}
      {/* Stock Details Drawer */}
      <Transition appear show={!!modal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[300]"
          onClose={() => setModal(null)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out transform-gpu transition-transform duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in transform-gpu transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="dark:bg-dark-700 fixed top-0 right-0 flex h-full w-full max-w-4xl transform-gpu flex-col bg-white shadow-2xl transition-transform duration-200">
              {/* Header */}
              <div className="dark:border-dark-500 flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <h2 className="dark:text-dark-50 text-lg font-semibold text-gray-800">
                    Stock Details
                  </h2>
                  <p className="dark:text-dark-300 mt-0.5 text-xs text-gray-500">
                    {modal?.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="size-5" />
                </button>
              </div>

              {/* Body */}
              <div className="grow overflow-auto p-5">
                <div className="dark:border-dark-500 overflow-x-auto rounded-lg border border-gray-300">
                  <Table className="w-full border-collapse text-left">
                    <THead>
                      <Tr>
                        {[
                          "#",
                          "Chassis No",
                          "Variant",
                          "Colour",
                          "Battery No",
                          "Key No",
                          "Battery Make",
                          "Motor No",
                          "Branch",
                        ].map((h) => (
                          <Th
                            key={h}
                            className={`${cell} dark:bg-dark-600 bg-gray-100 font-semibold whitespace-nowrap`}
                          >
                            {h}
                          </Th>
                        ))}
                      </Tr>
                    </THead>
                    <TBody>
                      {modal?.list.map((v, idx) => (
                        <Tr key={v.id}>
                          <Td className={cell}>{idx + 1}</Td>
                          <Td className={cell}>{v.chassisNo}</Td>
                          <Td className={cell}>{v.variantName}</Td>
                          <Td className={cell}>{v.colour}</Td>
                          <Td className={cell}>{v.batteryNo}</Td>
                          <Td className={cell}>{v.keyNumber || "-"}</Td>
                          <Td className={cell}>{v.batteryMake || "-"}</Td>
                          <Td className={cell}>{v.engineNo}</Td>
                          <Td className={cell}>{v.branchName || "-"}</Td>
                        </Tr>
                      ))}
                    </TBody>
                  </Table>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </div>
  );
};

export default BranchWiseInventory;
