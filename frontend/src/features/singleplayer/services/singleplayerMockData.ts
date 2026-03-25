import type {
  SingleplayerAvatar,
  SingleplayerCategory,
  SingleplayerLeaderboardEntry,
  SingleplayerLevel,
  SingleplayerQuestion,
  SingleplayerReward,
} from "../types/singleplayer";

export const avatars: SingleplayerAvatar[] = [
  {
    id: "avatar-1",
    name: "Vector Pulse",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzn_jdtwWQZE2rzf_58n0v6nw4RpICD9ES-z1vlFnvzKgf4rUhHTbxjGE1MlNwldEybnR4o1eqZbHXxhBW77M4LiTLgsX1EQ7JB9D7dBTJbpdW47iH28_BdXTJZuhL6xZex2Il1AyZEWXL-syxHAozXDXjUiAJHs0CGn2W3i_49vbTgSZnCaZ7Jn0c6tJK--HbbV5b9EOXP_jduDeYSQz2XBvu-6YxI-tyMwmaHEvuAt7GAIfn_D8MJF8SeYncGIvz5yWP4prLtlnN",
    badge: "Rookie",
  },
  {
    id: "avatar-2",
    name: "Neon Ninja",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7nMCXNdvgdXP8RJ6TRf53gQlOY2mIVaU9SR2D4QlLtbsp7lmHyHsQ2mqbbUvaBsJTSO44lPhBLQp9Kj99X9A4tzkjFNdkVqLuC1Lchd6glRoAwt9W_nGFhMv0JDuQJifGKkJkQBENExnkBKkWCPC2JhEsCeJLqbqITdqOiADDlkiwxiBCpRAZjem5MkGQshmBIfZG7gYPuFkV_5CEM5i-6vsgoXn5PmNfHi0uz0AOEBRVHLg8LHOS7sp6lq_3H_y6MP7e8QoPmZ_X",
    badge: "PRO",
  },
  {
    id: "avatar-3",
    name: "Data Diver",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSE6yXo_zLP2aPXCKskANm7HA1i68JOy_Rwx2o0bUnRYfaqWrKJOvLMhxBajDBlSIQj1e1I3ltqjr4lsIb2vxArJusPzm2cIsn0CLIxq7uwytKgPhMW6uC7SYlF8UqsKp_NB4AoPlTbdzFH-nN1mhwHj5x3uaSKPUBVbYLR8MF2jbsa_Fr0CYB3pFQGWRMy9yX0WYgo_tDaSX0Mao7eZCrI3Ne4X7AOcI1Ur9OAO3RmDHB2FNnUQuWfJ9ogYOW2tSIB1t_Tu8z_yBu",
    badge: "Scout",
  },
  {
    id: "avatar-4",
    name: "Pulse Rider",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4GMLxOfSm8UeCZ4WmhmekoZgzRr3tMIYWnwNTmWLNxLL7J0rHutBpuX3G3iZOb3Fp6sQ8ez2DwoEg2fcejfaNZB7Llys2pA0N9lGo1ec0bxopbeLty0VAiydsvzOAdmMZ9jG_k8tb4OOxv67n1wQsL0GagzdXwsQIt2jKjRZfMyvy7nV_P0x4Y73HUahl177Rq5aG7BW_BqeKyRzAVokLRg8_UQ4J3yEJn4rTKuU5gfSy4Pkb7fDt6tnkSerHtxZoKiC4lZ-J0jeI",
    badge: "Elite",
  },
  {
    id: "avatar-5",
    name: "Static Ghost",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCF1TxvdaA_E3oLMka1Mc78dRsn5DgDIxS2od3lLmLUasdKb0lcLOjI9IevJJyYe6mwUoxGTDae8F2ZCIYk1knCJelZaVaosInAhuVVK9Qr-CCqXvRkaTew_v5qUQBihXFfjzkYpISYn45GJnjw4IXDgQZfrfdIWLdBe9r8bOoP2RW6SbFGHNHSjYR3-VDEH5-qSAdf8RXnAJEXsaMsTEP6vp59IX5Kb7-0LQ_hYOBu1gGXdaKetCSU5l1RUW5jFHAbhdeqBMyPDUNQ",
    badge: "Mythic",
  },
];

export const categories: SingleplayerCategory[] = [
  {
    id: "general",
    title: "Wiedza Ogólna",
    icon: "neurology",
    description: "Przekrój tematów, szybkie tempo i dobry test refleksu.",
    difficulty: "Uniwersalny",
    accent: "bg-[#e08dff]",
    iconTone: "text-[#e08dff]",
    iconSurface: "bg-[#e08dff]/10",
    difficultyTone: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
    progressLabel: "Wiedza Ogólna",
  },
  {
    id: "history",
    title: "Historia",
    icon: "history_edu",
    description: "Wielkie bitwy, władcy i epokowe wydarzenia.",
    difficulty: "Strategiczny",
    accent: "bg-[#ff68a7]",
    iconTone: "text-[#ff68a7]",
    iconSurface: "bg-[#ff68a7]/10",
    difficultyTone: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30",
    progressLabel: "Historia",
  },
  {
    id: "science",
    title: "Nauka",
    icon: "science",
    description: "Od fizyki kwantowej po biologię morską.",
    difficulty: "Analityczny",
    accent: "bg-[#8ff5ff]",
    iconTone: "text-[#8ff5ff]",
    iconSurface: "bg-[#8ff5ff]/10",
    difficultyTone: "bg-orange-500/10 text-orange-400 ring-orange-500/30",
    progressLabel: "Nauka",
  },

  {
    id: "games",
    title: "Gry",
    icon: "sports_esports",
    description: "Klasyki arcade i nowoczesne hity AAA.",
    difficulty: "Legendarny",
    accent: "bg-[#bc00fb]",
    iconTone: "text-[#bc00fb]",
    iconSurface: "bg-[#bc00fb]/10",
    difficultyTone: "bg-red-500/10 text-red-400 ring-red-500/40",
    progressLabel: "Gry",
  },
];

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
