export type Scene = { id: string; num: string; label: string };

/** Scenes that exist on the page, in order. Add one per finished section. */
export const SCENES: Scene[] = [
  { id: "s01", num: "01", label: "Mở đầu" },
  { id: "s02", num: "02", label: "Thanh điệu" },
  { id: "s03", num: "03", label: "Sáu thanh" },
  { id: "s04", num: "04", label: "Vẽ giọng" },
  { id: "s05", num: "05", label: "Nói lại" },
  { id: "s06", num: "06", label: "Nghe và chọn" },
  { id: "s07", num: "07", label: "Bắc – Nam" },
  { id: "s08", num: "08", label: "Dấu từ đâu đến" },
  { id: "s09", num: "09", label: "Kết" },
];
