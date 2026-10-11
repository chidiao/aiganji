export const GANJI_BACKGROUNDS = [
  'https://picsum.photos/id/1015/1200/800',
  'https://picsum.photos/id/1016/1200/800',
  'https://picsum.photos/id/1018/1200/800',
  'https://picsum.photos/id/1019/1200/800',
  'https://picsum.photos/id/1020/1200/800',
  'https://picsum.photos/id/1021/1200/800',
  'https://picsum.photos/id/1022/1200/800',
  'https://picsum.photos/id/1036/1200/800',
  'https://picsum.photos/id/1039/1200/800',
  'https://picsum.photos/id/1043/1200/800',
  'https://picsum.photos/id/1044/1200/800',
  'https://picsum.photos/id/1057/1200/800',
] as const;

export function randomBackground() {
  return GANJI_BACKGROUNDS[Math.floor(Math.random() * GANJI_BACKGROUNDS.length)];
}
