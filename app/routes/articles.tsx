import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Articles" }];
};

export default function ArticlesRoute() {
  return (
    <>
      <div>
        <h2>Articles</h2>
        <Link to="/404">Not found</Link>
      </div>
      <Outlet />
    </>
  );
}
