import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";

interface SideDrawerProps {
  show: boolean;
  onClose: () => void;
  title: string;
  widthClass?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const SideDrawer = ({
  show,
  onClose,
  title,
  widthClass = "max-w-2xl",
  footer,
  children,
}: SideDrawerProps) => (
  <Transition appear show={show} as={Fragment}>
    <Dialog as="div" className="relative z-[100]" onClose={onClose}>
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
        <DialogPanel
          className={`dark:bg-dark-700 fixed top-0 right-0 flex h-full w-full ${widthClass} transform-gpu flex-col bg-white shadow-2xl transition-transform duration-200`}
        >
          <div className="bg-primary-600 dark:bg-primary-700 flex items-center justify-between px-5 py-4">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <Button
              onClick={onClose}
              variant="flat"
              isIcon
              className="size-8 rounded-full text-white hover:bg-white/10 hover:text-white focus:bg-white/10 active:bg-white/20"
              type="button"
            >
              <XMarkIcon className="size-5" />
            </Button>
          </div>

          <div className="grow overflow-y-auto p-5">{children}</div>

          {footer && (
            <div className="dark:border-dark-500 flex items-center justify-end gap-3 border-t border-gray-200 p-5">
              {footer}
            </div>
          )}
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </Transition>
);

export default SideDrawer;