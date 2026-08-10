import type { EcoLocation } from "./types";

const EN_LOCATION_NAMES: Record<string, string> = {
  "of-01": "Mangrove Reserve Outfall B1",
  "of-02": "Mangrove Reserve Outfall B2",
  "of-03": "Mangrove Reserve Outfall B3",
  "of-04": "Mangrove Reserve Outfall B4",
  "of-05": "Outfall D1 near Dasha River Estuary",
  "of-06": "Shenzhen Bay North Shore Outfall 4-1",
  "of-07": "Shenzhen Bay North Shore Outfall 4-2",
  "of-08": "Shenzhen Bay North Shore Outfall 4-3",
  "of-09": "Shenzhen Bay North Shore Outfall 4-4",
  "of-10": "Shenzhen Bay North Shore Outfall 4-5",
  "of-11": "Shenzhen Bay North Shore Outfall 4-6",
  "ws-01": "Jingang River tributary of Zhenjiang (Xiadong Water)",
  "ws-02": "Zhenjiang River (Yanjiangnan Ecological Culture Park)",
  "ws-03": "Beijiang River (Beijiang Greening Square)",
  "ws-04": "Jingshuikeng Stream",
  "ws-05": "Kongjiang Reservoir",
  "ws-06": "Beijiang River (Renhua Section)",
  "ws-07": "Beijiang River (Baima Jiangnan Waterworks)",
  "ws-08": "Beijiang–Wengjiang Confluence",
  "ws-09": "Beijiang Headwaters (Shijie Reservoir)",
  "ws-10": "Upstream of Shawan No. 1 Waterworks",
  "ws-11": "Upper Qiuxiang River (Beikeng Village)",
  "ws-12": "Dongjiang–Xinfengjiang Confluence",
  "ws-13": "Danshui–Dingxiang River Confluence",
  "ws-14": "Longgang–Danshui River (Shenzhen–Huizhou Boundary)",
  "ws-15": "Longgang River (Longyuan Section)",
  "ws-16": "Dongjiang Headwaters Waterfall",
  "ws-17": "Shunde Longjiang (Zuotan)",
  "ws-18": "Lecong Fu'an River",
  "ws-19": "Fuchuan River",
  "ws-20": "Hejiang Tributary",
  "ws-21": "Maozhou River (Gonghecun Section)",
  "ws-22": "Wutongshan River (Upper Reach)",
  "ws-23": "Maozai Stream",
  "ws-24": "Kuichong River (Upper Reach)",
  "ws-25": "Kuichong River (Lower Reach / Estuary)",
  "ws-26": "Xinda River (Xinda Wetland)",
  "ws-27": "Wangmu River (Lower Reach)",
  "ws-28": "Futian River (Lower Reach)",
  "ws-29": "Xinlang Village (Moyang River Tributary)",
  "ws-30": "Hanjiang Waisha River (Lower Reach)",
  "ws-31": "Rongjiang River (Niutianyang Estuary)",
  "ws-32": "Lianjiang River Estuary",
  "ws-33": "Ganzhutan Xijiang Water Intake",
  "ws-34": "Nansha Shijiu Stream (Mangrove Wetland)",
  "ws-35": "Hongqimen Waterway (Lower Reach)",
  "ws-36": "Yamen Ferry",
  "ws-37": "Modaomen (Camp No. 5)",
  "ws-38": "Dongjiang South Tributary",
};

const EN_BASINS: Record<string, string> = {
  北江流域: "Beijiang Basin",
  东江流域: "Dongjiang Basin",
  西江流域: "Xijiang Basin",
  河海口: "River–estuary zone",
};

export function locationName(location: EcoLocation, language: "zh" | "en") {
  return language === "en" ? (EN_LOCATION_NAMES[location.id] ?? location.name) : location.name;
}

export function basinName(basin: string | undefined, language: "zh" | "en") {
  if (!basin) return "";
  return language === "en" ? (EN_BASINS[basin] ?? basin) : basin;
}

export function locationCategory(location: EcoLocation, language: "zh" | "en") {
  if (language === "zh") return location.category;
  if (location.type === "outfall") return "Bay outfall · 2015 historical survey";
  return `${basinName(location.waterSample?.basin, language)} · 2023 rapid field test`;
}
