export interface ScraperScrapeResult {
  flaggedDomain: boolean;
  containsCensored: boolean;
  filteredTexts: string[];
}
