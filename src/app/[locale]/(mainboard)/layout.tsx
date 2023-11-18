import { Icons } from "~/components/icons";
import { Counter } from "~/components/nav";
// import { Counter } from "~/components/counter";

import { SiteFooter } from "~/components/site-footer";
import { Button } from "~/components/ui/button";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //Check if user is logged in
  // const session = await getServerAuthSession();
  // if (!session) {
  //   redirect("/login");
  // }

  return (
    <>
      <div className="flex">
        <aside className="flex h-screen w-52">
          {/* <Pig /> */}
          {/* <AsideHiddenNav /> */}
          {/* <div>
                <h1>hello</h1>
              </div> */}
          <Counter />
          <div className="flex h-full flex-col-reverse">
            <Button variant="ghost" size="sm">
              <Icons.asideSwitch className="h-4 w-4 origin-center transition" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </aside>
        <main className="flex h-full flex-col overflow-y-auto">{children}</main>
      </div>
      <SiteFooter className="border-t" />
    </>
  );
}
