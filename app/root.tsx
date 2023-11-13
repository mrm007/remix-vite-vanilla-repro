import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";

import "./global.css";
import "./global.vanil_a.css";
// import "./global.vanilla.css"; // ! uncomment to crash the build
import * as styles from "./styles.css";

export const meta: MetaFunction = () => [{ title: "New Remix App" }];

export const links: LinksFunction = () =>
  cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : [];

const navLinkClassName = ({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}): string => (isActive ? `${styles.active} global-active global-vanilla-active` : "");

const Nav = () => {
  return (
    <header>
      <nav>
        <NavLink className={navLinkClassName} to="/" end>
          Home
        </NavLink>{" "}
        |{" "}
        <NavLink className={navLinkClassName} to="/articles">
          Articles
        </NavLink>
      </nav>
    </header>
  );
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Nav />
        <Outlet />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}
