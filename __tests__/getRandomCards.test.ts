import { getRandomCards } from "@/app/data/cards";

describe("getRandomCards", () => {
  it("returns the requested number of unique cards", () => {
    const cards = getRandomCards(10);
    const ids = cards.map(card => card.id);
    const uniqueIds = new Set(ids);
    expect(cards).toHaveLength(10);
    expect(uniqueIds.size).toBe(cards.length);
  });

  it("assigns a boolean isReversed property to each card", () => {
    const cards = getRandomCards(10);
    cards.forEach(card => {
      expect(typeof card.isReversed).toBe("boolean");
    });
  });

  it("ensures each card has a defined, non-empty imagePath", () => {
    const cards = getRandomCards(10);
    cards.forEach(card => {
      expect(card.imagePath).toBeDefined();
      expect(typeof card.imagePath).toBe("string");
      expect(card.imagePath).not.toBe("");
    });
  });
});
