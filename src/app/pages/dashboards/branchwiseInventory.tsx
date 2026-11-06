import { useEffect, useMemo, useState, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
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

const BranchWiseInventory = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [modal, setModal] = useState<{ title: string; list: any[] } | null>(
    null,
  );

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
  const modelSpan = useMemo(() => {
    const span: Record<number, number> = {};
    let start = 0;
    rows.forEach((r, i) => {
      if (i === 0 || r.model !== rows[i - 1].model) {
        start = i;
        span[start] = 1;
      } else {
        span[start] += 1;
        span[i] = 0;
      }
    });
    return span;
  }, [rows]);

  return (
    <div className="min-h-screen bg-white p-6 dark:bg-gray-900">
      <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Branch Wise Inventory
        </h2>
      </div>

      <div className="hide-scrollbar dark:border-dark-500 min-w-full overflow-x-auto rounded-lg border border-gray-300">
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
            {rows.map((r, i) => {
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

            {/* Grand Total Row */}
            {rows.length > 0 && (
              <Tr className="dark:bg-dark-600 bg-gray-100 font-semibold">
                <Td colSpan={4} className={`${cell} text-right`}>
                  TOTAL
                </Td>
                {branches.map((b) => (
                  <Td key={b.id} className={`${cell} text-center`}>
                    {rows.reduce(
                      (s, r) => s + (r.byBranch[b.id]?.length || 0),
                      0,
                    )}
                  </Td>
                ))}
                <Td className={`${cell} text-center`}>{vehicles.length}</Td>
              </Tr>
            )}

            {rows.length === 0 && (
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