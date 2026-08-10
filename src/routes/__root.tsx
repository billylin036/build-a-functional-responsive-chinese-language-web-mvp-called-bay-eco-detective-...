import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppStateProvider } from "../lib/app-state";
import { LanguageProvider, useLanguage } from "../lib/language";
import { Toaster } from "../components/ui/sonner";
import { Languages } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">没有找到这个页面</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          你访问的页面不存在，或者已经移动到其他位置。
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            返回地图
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">页面暂时无法加载</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          加载过程中出现了问题。你可以重试，或者返回地图继续探索。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            重试
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            返回地图
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "湾区生态侦探 · 深圳湾互动科普地图" },
      {
        name: "description",
        content:
          "面向学校与学生的深圳湾生态学习地图：可靠知识卡、差异化挑战题、互动观察、综合评估与学习证书。",
      },
      { property: "og:title", content: "湾区生态侦探 · 深圳湾互动科普地图" },
      {
        property: "og:description",
        content: "读取证据、提出解释、完成挑战、规范观察。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/", zh: "地图", en: "Map" },
  { to: "/learn", zh: "学习闯关", en: "Learning Quest" },
  { to: "/resources", zh: "资料库", en: "Sources" },
  { to: "/me", zh: "学习成果", en: "My Progress" },
  { to: "/about", zh: "关于", en: "About" },
] as const;

function AppChrome() {
  const { language, toggleLanguage, tr } = useLanguage();
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => {
    const englishTitles: Record<string, string> = {
      "/": "Bay Eco Detective | Interactive Environmental Map",
      "/learn": "Learning Quest | Bay Eco Detective",
      "/resources": "Sources | Bay Eco Detective",
      "/me": "My Progress | Bay Eco Detective",
      "/about": "About | Bay Eco Detective",
    };
    const chineseTitles: Record<string, string> = {
      "/": "湾区生态侦探 | 深圳湾互动科普地图",
      "/learn": "学习闯关 | 湾区生态侦探",
      "/resources": "学习资料库 | 湾区生态侦探",
      "/me": "学习成果 | 湾区生态侦探",
      "/about": "关于项目与数据说明 | 湾区生态侦探",
    };
    document.title =
      language === "en"
        ? (englishTitles[pathname] ?? "Location Evidence | Bay Eco Detective")
        : (chineseTitles[pathname] ?? "地点证据 | 湾区生态侦探");
  }, [language, pathname]);

  return (
    <div className="app-shell flex flex-col">
      <header className="sticky top-0 z-[1200] shrink-0 border-b border-border bg-navy">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2.5 sm:px-4">
          <Link to="/" className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
            {tr("湾区生态侦探", "Bay Eco Detective")}
            <span className="ml-2 hidden text-xs font-normal opacity-80 lg:inline">
              {tr("深圳湾互动科普地图", "Interactive environmental learning map")}
            </span>
          </Link>
          <nav className="flex min-w-0 gap-1 overflow-x-auto text-xs">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="whitespace-nowrap rounded-sm px-2 py-1 text-white/75 transition-colors hover:bg-white/10 hover:text-white data-[status=active]:bg-white/15 data-[status=active]:text-white"
              >
                {language === "zh" ? n.zh : n.en}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={tr("切换为英文", "Switch to Chinese")}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/25 px-2 py-1 text-xs font-semibold text-white hover:bg-white/10"
          >
            <Languages className="size-3.5" />
            {language === "zh" ? "EN" : "Chinese"}
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppStateProvider>
          <AppChrome />
          <Toaster position="top-center" />
        </AppStateProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
