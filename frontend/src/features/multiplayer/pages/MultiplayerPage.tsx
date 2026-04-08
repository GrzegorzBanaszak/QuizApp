import { ModeUnderConstruction } from "../../shared/components/ModeUnderConstruction";

export const MultiplayerPage = () => {
  return (
    <ModeUnderConstruction
      title="Multiplayer"
      eyebrow="Tryb sieciowy"
      description="Przygotowujemy tryb sieciowy z pokojami, zapraszaniem znajomych i synchronizacją graczy w czasie rzeczywistym."
      statusPrimary="Lobby: w przygotowaniu"
      statusSecondary="Mecze: integracja"
    />
  );
};
