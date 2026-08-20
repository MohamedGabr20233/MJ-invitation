import ComingPage from "./coming/ComingPage";
import InvitationGate from "./components/gate/InvitationGate";
import WeddingSite from "./site/WeddingSite";

/**
 * The whole router. Two pages, no library: the invitation, and `/coming` with
 * the answers. Read once at module load — neither page links to the other, so
 * there is no in-app navigation to keep in sync, and a url change is a reload.
 */
const isComingRoute = window.location.pathname.replace(/\/+$/, "") === "/coming";

const App = () => {
  if (isComingRoute) return <ComingPage />;

  return (
    <main className="min-h-dvh w-full bg-surface-alt">
      <InvitationGate>
        <WeddingSite />
      </InvitationGate>
    </main>
  );
};

export default App;
