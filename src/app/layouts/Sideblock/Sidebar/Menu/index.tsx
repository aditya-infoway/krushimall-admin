// Import Dependencies
import { useLocation } from "react-router";
import { useLayoutEffect, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";

// Local Imports
import { useDidUpdate } from "@/hooks";
import { navigation } from "@/app/navigation";
import { Accordion } from "@/components/ui";
import { isRouteActive } from "@/utils/isRouteActive";
import { useAuthContext } from "@/app/contexts/auth/context";
import { Group } from "./Group";

// ----------------------------------------------------------------------

// Logout ko list se alag rakho, uska apna button niche hai
const mainNav = navigation.filter((item) => item.id !== "logout");

export function Menu() {
  const { pathname } = useLocation();
  const { logout } = useAuthContext();
  const ref = useRef<HTMLDivElement | null>(null);

  const activeGroup = mainNav.find((item) => {
    if (item.path) return isRouteActive(item.path, pathname);
  });

  const activeCollapsible = activeGroup?.childs?.find((item) => {
    if (item.path) return isRouteActive(item.path, pathname);
  });

  const [expanded, setExpanded] = useState<string | null>(
    activeCollapsible?.path || null,
  );
  const [openedGroup, setOpenedGroup] = useState<string | null>(
    mainNav[0]?.id || null,
  );

  useDidUpdate(() => {
    if (activeCollapsible?.path !== expanded)
      setExpanded(activeCollapsible?.path || null);
  }, [activeCollapsible?.path]);

  useLayoutEffect(() => {
    const activeItem = ref.current?.querySelector("[data-menu-active=true]");
    activeItem?.scrollIntoView({ block: "center" });
  }, []);

  const handleLogout = async () => {
    await logout();
    // Full reload: GhostGuard purani state dekh kar redirect na kare
    window.location.replace("/krushimall-admin/login");
  };

  return (
    <div className="flex h-full flex-col">
      <SimpleBar
        scrollableNodeProps={{ ref }}
        className="min-h-0 flex-1 overflow-x-hidden pb-6"
      >
        <Accordion
          value={expanded}
          onChange={setExpanded}
          className="space-y-1"
        >
          {mainNav.map((nav) => (
            <Group
              key={nav.id}
              data={nav}
              isOpened={openedGroup === nav.id}
              onToggle={() =>
                setOpenedGroup(openedGroup === nav.id ? null : nav.id)
              }
            />
          ))}
        </Accordion>
      </SimpleBar>

      {/* Pinned logout button */}
      <div className="px-3 py-2">
        <button
          type="button"
          onClick={handleLogout}
          className="group dark:text-dark-200 dark:hover:bg-dark-300/10 dark:hover:text-dark-50 flex w-full min-w-0 items-center gap-3 rounded-md px-3 py-2 text-xs-plus font-medium tracking-wide text-gray-800 outline-hidden transition-colors ease-in-out hover:bg-gray-100 hover:text-gray-950 focus:bg-gray-100"
        >
          <ArrowLeftStartOnRectangleIcon className="size-5 shrink-0 stroke-[1.5] opacity-80 group-hover:opacity-100" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </div>
  );
}