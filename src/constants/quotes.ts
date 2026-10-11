export const QUOTES = [
  '慢慢来，比较快。',
  '你只管努力，剩下的交给时间。',
  '热爱可抵岁月漫长。',
  '所有的坚持，终将美好。',
  '与其焦虑，不如行动。',
  '今天的你，胜过昨天的你。',
  '心之所向，素履以往。',
  '生活明朗，万物可爱。',
  '但行好事，莫问前程。',
  '愿你所行皆坦途。',
  '把日子过成自己喜欢的样子。',
  '保持热爱，奔赴山海。',
] as const;

export function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
