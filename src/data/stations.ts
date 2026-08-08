export interface MonitoringStation {
  id: string;
  name: string;
  locationId: string;
  taskId: string;
  theme: string;
  cadenceDays: number;
  cadenceLabel: string;
  purpose: string;
  focus: string[];
  protocol: string[];
}

export const monitoringStations: MonitoringStation[] = [
  {
    id: "station-mangrove-north",
    name: "红树林北岸定点共测站",
    locationId: "mg-01",
    taskId: "task-mangrove-photo",
    theme: "红树林生长",
    cadenceDays: 30,
    cadenceLabel: "每月 1 次",
    purpose: "用相同机位的连续照片观察幼苗成活、缺株与滩面变化。",
    focus: ["固定角度照片", "幼苗长势", "潮位", "滩面垃圾"],
    protocol: [
      "站在观景平台标记点，不进入滩涂",
      "拍摄一张横向全景和一张幼苗近景",
      "记录天气、潮位和肉眼可见的变化",
    ],
  },
  {
    id: "station-outfall-b4",
    name: "B4 排口水情共测站",
    locationId: "of-04",
    taskId: "task-water-color",
    theme: "排口水情",
    cadenceDays: 14,
    cadenceLabel: "每两周 1 次",
    purpose: "持续记录非降雨时段是否有水、水色和气味，补足单次监测的盲区。",
    focus: ["是否有水", "水色", "气味", "是否降雨"],
    protocol: [
      "只在公共步道或安全岸线上观察",
      "拍摄包含排口和周边环境的全景",
      "按统一选项记录水色、流量与气味",
    ],
  },
  {
    id: "station-bird-west",
    name: "深圳湾西部观鸟共测站",
    locationId: "tp-01",
    taskId: "task-bird",
    theme: "滨海鸟类",
    cadenceDays: 30,
    cadenceLabel: "每月 1 次",
    purpose: "在相近潮位和时段记录鸟类数量，形成可比较的季节变化序列。",
    focus: ["鸟类数量", "主要行为", "潮位", "人为干扰"],
    protocol: [
      "优先在退潮前后 1 小时观察",
      "保持距离，不追逐或惊飞鸟类",
      "记录大致数量、行为和现场干扰",
    ],
  },
  {
    id: "station-shoreline-east",
    name: "东段岸线垃圾共测站",
    locationId: "tp-02",
    taskId: "task-waste",
    theme: "岸线垃圾",
    cadenceDays: 30,
    cadenceLabel: "每月 1 次",
    purpose: "重复记录同一段岸线的垃圾类型与数量，识别反复出现的污染来源。",
    focus: ["塑料", "泡沫", "渔具", "垃圾聚集点"],
    protocol: [
      "沿指定 50 米岸线从西向东观察",
      "按塑料、泡沫、渔具和生活垃圾分类",
      "重点拍摄缠绕植被或集中堆积的位置",
    ],
  },
];

export const getMonitoringStation = (id?: string) =>
  monitoringStations.find((station) => station.id === id);

export function nextObservationDate(sourceDate: string, cadenceDays: number) {
  const date = new Date(sourceDate);
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + cadenceDays);
  return date;
}
