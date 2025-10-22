// Portfolio color mapping utility
const portfolioColorMap: Record<string, string> = {};

const colorPalette = [
  "bg-blue-700 text-white",
  "bg-green-700 text-white",
  "bg-purple-700 text-white",
  "bg-orange-700 text-white",
  "bg-pink-700 text-white",
  "bg-teal-700 text-white",
  "bg-indigo-700 text-white",
  "bg-red-700 text-white",
  "bg-yellow-700 text-white",
  "bg-cyan-700 text-white",
  "bg-emerald-700 text-white",
  "bg-violet-700 text-white",
  "bg-fuchsia-700 text-white",
  "bg-rose-700 text-white",
  "bg-sky-700 text-white",
];

export function getPortfolioColor(portfolio: string | null | undefined): string {
  if (!portfolio) return "bg-gray-700 text-white";
  
  if (!portfolioColorMap[portfolio]) {
    const colorIndex = Object.keys(portfolioColorMap).length % colorPalette.length;
    portfolioColorMap[portfolio] = colorPalette[colorIndex];
  }
  
  return portfolioColorMap[portfolio];
}
