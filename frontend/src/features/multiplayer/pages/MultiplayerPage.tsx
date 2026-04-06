import { ModeUnderConstruction } from "../../shared/components/ModeUnderConstruction";

export const MultiplayerPage = () => {
  return (
    <ModeUnderConstruction
      title="Multiplayer"
      eyebrow="Tryb sieciowy"
      description="Trwają prace nad nowym flow multiplayera, w tym pokojami, ekranem hosta i synchronizacją graczy."
      statusPrimary="Lobby: Projektowanie"
      statusSecondary="Matchmaking: Integracja"
    />
  );
};
