import type {
  SingleplayerLeaderboardEntry,
  SingleplayerLevel,
  SingleplayerQuestion,
  SingleplayerReward,
} from "../types/singleplayer";

export const levels: SingleplayerLevel[] = [
  {
    id: "easy",
    letter: "S",
    title: "Easy (Łatwy)",
    subtitle: "Status: Zaliczony",
    state: "completed",
    accent: "primary",
  },
  {
    id: "medium",
    letter: "A",
    title: "Medium (Średni)",
    subtitle: "Status: Zaliczony",
    state: "completed",
    accent: "secondary",
  },
  {
    id: "hard",
    letter: "B",
    title: "Hard (Trudny)",
    subtitle: "Status: Dostępny",
    state: "available",
    accent: "primary",
  },
  {
    id: "expert",
    letter: "E",
    title: "Expert (Ekspert)",
    subtitle: "Status: Zablokowany",
    state: "locked",
    accent: "neutral",
    lockedMessage: "Ukończ Hard, aby odblokować",
  },
  {
    id: "legendary",
    letter: "L",
    title: "Legendary (Legendarny)",
    subtitle: "Status: Zablokowany",
    state: "locked",
    accent: "neutral",
    lockedMessage: "Wymagany Level 50",
  },
];

export const question: SingleplayerQuestion = {
  id: "q-1",
  prompt: "Który z tych filmów otrzymał Oscara za najlepsze efekty specjalne?",
  answers: [
    "Interstellar",
    "Mroczny Rycerz",
    "Wilk z Wall Street",
    "Pulp Fiction",
  ],
  correctAnswerIndex: 0,
  aiLabel: "AI Generated",
};

export const rewards: SingleplayerReward[] = [
  {
    id: "reward-badge",
    title: "Neonowy Łowca",
    subtitle: "Unikalna odznaka",
    icon: "military_tech",
    accent: "primary",
  },
  {
    id: "reward-skin",
    title: "Cyber-Widmo",
    subtitle: "Nowy skin",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC19Mi3AxM0_vfmRozg7JngSI55EuJ8zkblJVBDV8yndn0Kf5uF-1YsYQTvYgFs4iYtgR7mZNuIKLRKKvGib1sWoUyEY98Y4GDCi1JEPrvaznt-ZwNMNUwQloT92v4pyVoRG-Tbv5_-ay1T62FX9VhWYZNMRJ_mYnVnq0chVlTbAffdmlvRnJO7dUbEt2-pzSzasPSqlcBL25g_LOr9vX7e-OYm_RX09nGqZfdqa7qocLxUYcViBlAdvzfRR7n0UlGy-NpJ18B4w9R5",
    accent: "secondary",
  },
];

export const leaderboard: SingleplayerLeaderboardEntry[] = [
  {
    id: "lb-1",
    name: "Xenon_Pulse",
    score: "1,890",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGxkMVzt64zvkVigQeuSF_hfjS4w_uE9nzoIVJucaPiLl1e0HvQPdV7ZBI_ReRNJqurN3VyrZrhccpD1jwhlqYPD4hDILYJLRny5Ps2Z_ANUPSnhGL5UCL-sN68dsraBAfbE1xhSy2T2VdF9KStUocSq6xCeDolOXnZtgCdUkp1zABh7FYPXj4fCNdS7R5kkHz7KrRrCAMNyzYRQnDT5Ht00WopvzQtUUAljYx5XQrY8PY9xtlcX-RQ_2WvXyXXHEjqVsWUlnVrTfY",
    title: "Legendary Master",
  },
  {
    id: "lb-2",
    name: "NeonGhost",
    score: "1,725",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFxttumq_1lcFVOh6kWc1_k0Pt7DHaFSV-XoHvVKKI49vEzyu3OcnIt9rErIjEWlC0LKJCuxSVcI4tEC5a1pu-Qh104eStkprVCvliRy8NKDz5nlOU36phz-05DYbkTRiFbu5Rg5bBWvEyxu8CA_hsiDhG10qEW20Di-HQD0hwX54IBcL1TvVJ_l-ZhM3O9lQLSaGov9_7U3SiTJALAca3-I47wSC5jVEohi6RXRkUu2Y_zT6-szjYxOu6PZGdjJ1uOBD0jBG8-z1j",
  },
  {
    id: "lb-3",
    name: "VoidWalker",
    score: "1,680",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8ihJLfLTfYza7-svP2wjIaDAKU5WdZwXTOxlvrtdaBBW-Kdb2S9AllNZJgSIrbnFCUPmXrgtYEPcuz2VhtyU5-_PbULizIb7SL6E_Dtwth6nzDaS0JLXhH5l94oi3BZQjH0Vm1PnZC-b0MW1mHDAPSuTC4shbkPfOCjvw86CFwvngjSac8VE1s34b3qP_Rjb0Oi8nHoahJ-EZxGuoC_olY8kqr8i-sEmBbdBAx0DRhpKLpCwbfagawRjhA3RL7OWDQw7YZUX18yoF",
  },
  {
    id: "lb-me",
    name: "Ty (You)",
    score: "1,450",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsILEPQ0_h5LlGyJfrSqsbwnSPuru19-BWCepJGgyDirebEqOnm4SGVRKxYziz5feWeABemMSQrUoqPpjHuplT7cGsGzY1Zlvw5kWTeE2zYFepPjSbGfjO2FwcUUTz9xQCirg54yb-Bj8CZkfCmW4vaPMW3qCVilcjBPkUFwIOUFbqlf4VgM9emubnqoR69PijjiHaeKP8QHK62si-IxXkUasSu1YubTGsokRImEMD24HyCI5cxuiEoMlIRxMyHl22JmvkwTcICYoa",
    isCurrentPlayer: true,
  },
  {
    id: "lb-9",
    name: "PixelPunk",
    score: "1,390",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGxkMVzt64zvkVigQeuSF_hfjS4w_uE9nzoIVJucaPiLl1e0HvQPdV7ZBI_ReRNJqurN3VyrZrhccpD1jwhlqYPD4hDILYJLRny5Ps2Z_ANUPSnhGL5UCL-sN68dsraBAfbE1xhSy2T2VdF9KStUocSq6xCeDolOXnZtgCdUkp1zABh7FYPXj4fCNdS7R5kkHz7KrRrCAMNyzYRQnDT5Ht00WopvzQtUUAljYx5XQrY8PY9xtlcX-RQ_2WvXyXXHEjqVsWUlnVrTfY",
  },
  {
    id: "lb-10",
    name: "CyberRay",
    score: "1,310",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFxttumq_1lcFVOh6kWc1_k0Pt7DHaFSV-XoHvVKKI49vEzyu3OcnIt9rErIjEWlC0LKJCuxSVcI4tEC5a1pu-Qh104eStkprVCvliRy8NKDz5nlOU36phz-05DYbkTRiFbu5Rg5bBWvEyxu8CA_hsiDhG10qEW20Di-HQD0hwX54IBcL1TvVJ_l-ZhM3O9lQLSaGov9_7U3SiTJALAca3-I47wSC5jVEohi6RXRkUu2Y_zT6-szjYxOu6PZGdjJ1uOBD0jBG8-z1j",
  },
];
