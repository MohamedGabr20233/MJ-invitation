import InvitationGate from "./components/gate/InvitationGate";
import WeddingSite from "./site/WeddingSite";

const App = () => {
  return (
    <main className="min-h-dvh w-full bg-surface-alt">
      <InvitationGate>
        <WeddingSite />
      </InvitationGate>
    </main>
  );
};

export default App;
