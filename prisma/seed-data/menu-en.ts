/**
 * Bản dịch tiếng Anh cho nội dung thực đơn/khuyến mãi (Giai đoạn 15).
 *
 * Tách riêng khỏi `menu.ts` có chủ đích: diff nhỏ, mọi bản dịch nằm một chỗ, và thiếu
 * bản dịch nào là thấy ngay (test dưới cuối file này kiểm đủ/thiếu). Seed và script
 * backfill đều đọc từ đây.
 *
 * ⚠️ KHÔNG dịch: `slug` (nằm trong URL, đổi là hỏng link cũ + sitemap), và
 * `Review.content` (nội dung khách viết — giữ nguyên ngôn ngữ gốc mới đúng thực tế).
 */

export const DISH_EN: Record<string, { nameEn: string; descriptionEn: string }> = {
  "dish-ribeye-uc": {
    nameEn: "Australian Ribeye Steak",
    descriptionEn:
      "Evenly marbled Australian ribeye, pan-seared in garlic butter and thyme, served with black pepper sauce.",
  },
  "dish-tenderloin-my": {
    nameEn: "US Beef Tenderloin",
    descriptionEn:
      "Tender US beef tenderloin, charcoal-grilled and served with a wild mushroom sauce.",
  },
  "dish-tbone": {
    nameEn: "T-Bone Steak",
    descriptionEn:
      "Two cuts in one bone-in steak, grilled over charcoal and served with roast potatoes.",
  },
  "dish-suon-nuong": {
    nameEn: "BBQ Beef Ribs",
    descriptionEn:
      "Beef ribs marinated for 12 hours, slow-grilled over charcoal and glazed with house BBQ sauce.",
  },
  "dish-wagyu-a5": {
    nameEn: "A5 Wagyu Steak",
    descriptionEn:
      "Japanese A5 wagyu, flash-seared to keep it melting in the mouth, served with Himalayan salt.",
  },
  "dish-sup-bi-do": {
    nameEn: "Pumpkin Cream Soup",
    descriptionEn: "Pumpkin simmered smooth with fresh cream, finished with toasted pumpkin seeds.",
  },
  "dish-salad-caesar": {
    nameEn: "Grilled Prawn Caesar Salad",
    descriptionEn:
      "Romaine lettuce, Parmesan, crisp croutons and grilled prawns in Caesar dressing.",
  },
  "dish-escargot": {
    nameEn: "Garlic Butter Escargot",
    descriptionEn:
      "French snails pan-seared in garlic butter and parsley, served hot in a six-well dish.",
  },
  "dish-khoai-tay-nghien": {
    nameEn: "Garlic Butter Mashed Potatoes",
    descriptionEn: "Silky mashed potatoes folded with butter and fried garlic, topped with spring onion.",
  },
  "dish-mang-tay-nuong": {
    nameEn: "Grilled Asparagus with Parmesan",
    descriptionEn: "Asparagus grilled until crisp, covered with finely shaved Parmesan.",
  },
  "dish-nam-portobello": {
    nameEn: "Grilled Portobello Mushrooms",
    descriptionEn: "Portobello mushrooms grilled in garlic butter, served with a light truffle sauce.",
  },
  "dish-creme-brulee": {
    nameEn: "Crème Brûlée",
    descriptionEn: "Baked vanilla custard under a crisp caramelised sugar crust.",
  },
  "dish-tiramisu": {
    nameEn: "Italian Tiramisu",
    descriptionEn: "Traditional tiramisu with espresso coffee and mascarpone cheese.",
  },
  "dish-vang-do": {
    nameEn: "Cabernet Sauvignon Red Wine",
    descriptionEn: "Cabernet Sauvignon red wine, served by the 150ml glass.",
  },
  "dish-mocktail-berry": {
    nameEn: "Berry Sunset Mocktail",
    descriptionEn: "Strawberry, blueberry and passionfruit soda mocktail, alcohol-free.",
  },
};

export const PROMOTION_EN: Record<
  string,
  {
    titleEn: string;
    descriptionEn: string;
    badgeLabelEn: string;
    badgeOfferEn: string;
    scheduleTextEn: string;
  }
> = {
  "promo-steak-night": {
    titleEn: "Thursday Steak Night",
    descriptionEn: "30% off every steak, every Thursday evening.",
    badgeLabelEn: "MOST POPULAR",
    badgeOfferEn: "30% OFF",
    scheduleTextEn: "EVERY THURSDAY",
  },
  "promo-gio-vang": {
    titleEn: "Starter Happy Hour",
    descriptionEn: "A free side dish with any weekday booking between 17:00 and 19:00.",
    badgeLabelEn: "DAILY",
    badgeOfferEn: "FREE SIDE",
    scheduleTextEn: "MON-FRI, 17:00-19:00",
  },
  "promo-lang-man": {
    titleEn: "Romantic Offer for Two",
    descriptionEn: "200,000₫ off a set menu for two on weekends after 18:00.",
    badgeLabelEn: "ROMANTIC",
    badgeOfferEn: "200K OFF",
    scheduleTextEn: "FRI-SUN, AFTER 18:00",
  },
  "promo-combo-cuoi-tuan": {
    titleEn: "Family Weekend Combo",
    descriptionEn: "15% off bills over 1,200,000₫ on Saturdays and Sundays.",
    badgeLabelEn: "WEEKEND",
    badgeOfferEn: "15% OFF",
    scheduleTextEn: "SAT-SUN",
  },
  "promo-dat-nhieu": {
    titleEn: "Order More, Save More",
    descriptionEn: "10% off bills over 1,500,000₫, available every day.",
    badgeLabelEn: "SAVER",
    badgeOfferEn: "10% OFF",
    scheduleTextEn: "EVERY DAY",
  },
};
