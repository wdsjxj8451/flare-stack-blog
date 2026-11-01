import {
  useLocation,
  useRouteContext,
  useRouterState,
} from "@tanstack/react-router";
import type { PublicLayoutProps } from "@/components/layout/layout-props";
import { cn } from "@/lib/utils";
import { BackToTop } from "./back-to-top";
import { BackgroundImage, RandomBackgroundProvider } from "./random-background";
import { FloatingActionsProvider } from "./floating-actions";
import { Footer } from "./footer";
import { GlassPointer } from "./glass-pointer";
import { Navbar } from "./navbar";
import { PageFade } from "./page-fade";
import "./public-theme.css";

export function PublicLayout({
  children,
  navOptions,
  user,
  isSessionLoading,
  logout,
}: PublicLayoutProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isPostPage = useRouterState({
    select: (state) =>
      state.matches.some((match) => match.routeId === "/_public/post/$slug"),
  });
  return (
    <FloatingActionsProvider>
      <RandomBackgroundProvider source={siteConfig.theme.fuwari.homeBg}>
        <div
          className={cn(
            "public-site relative min-h-screen",
            isHomePage && "public-home-site",
            isPostPage && "public-reading-site",
          )}
        >
          <GlassPointer />
          <div className="public-ambient" aria-hidden="true">
            <div className="public-ambient-photo">
              <BackgroundImage priority={isHomePage} />
            </div>
            <div className="public-acrylic" />
          </div>
          <div className="sticky top-0 z-50 pointer-events-none">
            <div className="pointer-events-auto w-full">
              <Navbar
                navOptions={navOptions}
                logout={logout}
                user={user}
                isLoading={isSessionLoading}
                bannerHeightVh={isHomePage ? 44 : 16}
              />
            </div>
          </div>
          <div className="public-main-shell relative z-30">
            <div
              className="public-content-grid relative mx-auto px-5 pb-8 sm:px-8"
              style={{ maxWidth: isPostPage ? "84rem" : "72rem" }}
            >
              <main className="min-w-0">
                <PageFade includeSearch={location.pathname !== "/search"}>
                  {children}
                </PageFade>
              </main>
              <div className="public-footer">
                <Footer navOptions={navOptions} />
              </div>
              <BackToTop
                readingKey={isPostPage ? location.pathname : undefined}
              />
            </div>
          </div>
        </div>
      </RandomBackgroundProvider>
    </FloatingActionsProvider>
  );
}
