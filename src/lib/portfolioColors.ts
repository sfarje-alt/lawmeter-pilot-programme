// Portfolio color mapping utility
const portfolioColorMap: Record<string, string> = {};

const colorPalette = [
  "bg-blue-500 text-white",
  "bg-green-500 text-white",
  "bg-purple-500 text-white",
  "bg-orange-500 text-white",
  "bg-pink-500 text-white",
  "bg-teal-500 text-white",
  "bg-indigo-500 text-white",
  "bg-red-500 text-white",
  "bg-yellow-600 text-white",
  "bg-cyan-500 text-white",
  "bg-emerald-500 text-white",
  "bg-violet-500 text-white",
  "bg-fuchsia-500 text-white",
  "bg-rose-500 text-white",
  "bg-sky-500 text-white",
];

export function getPortfolioColor(portfolio: string | null | undefined): string {
  if (!portfolio) return "bg-gray-500 text-white";
  
  if (!portfolioColorMap[portfolio]) {
    const colorIndex = Object.keys(portfolioColorMap).length % colorPalette.length;
    portfolioColorMap[portfolio] = colorPalette[colorIndex];
  }
  
  return portfolioColorMap[portfolio];
}
