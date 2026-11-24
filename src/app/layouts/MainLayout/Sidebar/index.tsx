// // Import Dependencies
// import { useMemo, useState } from "react";
// import { useLocation } from "react-router";

// // Local Imports
// import { useBreakpointsContext } from "@/app/contexts/breakpoint/context";
// import { useSidebarContext } from "@/app/contexts/sidebar/context";
// import { navigation } from "@/app/navigation";
// import { useDidUpdate } from "@/hooks";
// import { isRouteActive } from "@/utils/isRouteActive";
// import { MainPanel } from "./MainPanel";
// import { PrimePanel } from "./PrimePanel";
// import { settings } from "@/app/navigation/segments/settings";
// // ----------------------------------------------------------------------

// export type SegmentPath = string | undefined;

// // settings rail me nahi dikhta, par uska panel chahiye
// const allSegments = [...navigation, settings];

// export function Sidebar() {
//   const { pathname } = useLocation();
//   const { name, lgAndDown } = useBreakpointsContext();
//   const { isExpanded, close } = useSidebarContext();

//   const initialSegment = useMemo(
//     () => allSegments.find((item) => isRouteActive(item.path, pathname)),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [],
//   );

//   const [activeSegmentPath, setActiveSegmentPath] = useState<SegmentPath>(
//     initialSegment?.path,
//   );

//   const currentSegment = useMemo(() => {
//     return allSegments.find((item) => item.path === activeSegmentPath);
//   }, [activeSegmentPath]);

//   useDidUpdate(() => {
//     const activePath = allSegments.find((item) =>
//       isRouteActive(item.path, pathname),
//     )?.path;

//     setActiveSegmentPath(activePath);
//   }, [pathname]);

//   useDidUpdate(() => {
//     if (lgAndDown && isExpanded) close();
//   }, [name]);

//   return (
//     <>
//       <MainPanel
//         nav={navigation}
//         activeSegmentPath={activeSegmentPath}
//         setActiveSegmentPath={setActiveSegmentPath}
//       />
//       <PrimePanel
//         close={close}
//         currentSegment={currentSegment}
//         pathname={pathname}
//       />
//     </>
//   );
// }




// Import Dependencies
import { useMemo, useState } from "react";
import { useLocation } from "react-router";

// Local Imports
import { useBreakpointsContext } from "@/app/contexts/breakpoint/context";
import { useSidebarContext } from "@/app/contexts/sidebar/context";
import { navigation } from "@/app/navigation";
import { useDidUpdate } from "@/hooks";
import { isRouteActive } from "@/utils/isRouteActive";
import { MainPanel } from "./MainPanel";
import { PrimePanel } from "./PrimePanel";
import { settings } from "@/app/navigation/segments/settings";
import { NavigationTree } from "@/@types/navigation";

// ----------------------------------------------------------------------

export type SegmentPath = string | undefined;

// settings rail me nahi dikhta, par uska panel chahiye
const allSegments = [...navigation, settings];

// Segment ke childs (nested collapse/group bhi) me current path hai ya nahi
function hasActiveChild(
  childs: NavigationTree[] | undefined,
  pathname: string,
): boolean {
  if (!childs) return false;

  return childs.some((child) => {
    if (child.path && isRouteActive(child.path, pathname)) return true;
    return hasActiveChild(child.childs, pathname);
  });
}

// "/usermaster/account" -> "/usermaster"
function getRootPrefix(path: string): string {
  return "/" + (path.split("/").filter(Boolean)[0] ?? "");
}

// Segment ke saare childs ke root prefixes (nested bhi)
function collectPrefixes(childs: NavigationTree[] | undefined): string[] {
  if (!childs) return [];

  return childs.flatMap((child) => [
    ...(child.path ? [getRootPrefix(child.path)] : []),
    ...collectPrefixes(child.childs),
  ]);
}

function hasMatchingPrefix(
  childs: NavigationTree[] | undefined,
  pathname: string,
): boolean {
  const pathRoot = getRootPrefix(pathname);
  return collectPrefixes(childs).includes(pathRoot);
}

// 1) exact child match
// 2) child ke root prefix se match (newaccount, edit, view jaise sub-pages)
// 3) segment ke apne path prefix se match
function findActiveSegmentPath(pathname: string): SegmentPath {
  const byChild = allSegments.find((segment) =>
    hasActiveChild(segment.childs, pathname),
  );
  if (byChild) return byChild.path;

  const byPrefix = allSegments.find((segment) =>
    hasMatchingPrefix(segment.childs, pathname),
  );
  if (byPrefix) return byPrefix.path;

  return allSegments.find((segment) => isRouteActive(segment.path, pathname))
    ?.path;
}

export function Sidebar() {
  const { pathname } = useLocation();
  const { name, lgAndDown } = useBreakpointsContext();
  const { isExpanded, close } = useSidebarContext();

  const [activeSegmentPath, setActiveSegmentPath] = useState<SegmentPath>(() =>
    findActiveSegmentPath(pathname),
  );

  const currentSegment = useMemo(() => {
    return allSegments.find((item) => item.path === activeSegmentPath);
  }, [activeSegmentPath]);

  useDidUpdate(() => {
    const next = findActiveSegmentPath(pathname);
    // Kuch match na mile to purana panel hi rehne do, khali na ho
    setActiveSegmentPath((prev) => next ?? prev);
  }, [pathname]);

  useDidUpdate(() => {
    if (lgAndDown && isExpanded) close();
  }, [name]);

  return (
    <>
      <MainPanel
        nav={navigation}
        activeSegmentPath={activeSegmentPath}
        setActiveSegmentPath={setActiveSegmentPath}
      />
      <PrimePanel
        close={close}
        currentSegment={currentSegment}
        pathname={pathname}
      />
    </>
  );
}