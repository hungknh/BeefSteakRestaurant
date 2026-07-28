// Mẫu câu đánh giá theo số sao — ghép cụm mở đầu + chi tiết + kết để tránh lặp y hệt
// giữa hàng trăm review. 5 sao ngắn gọn nhiệt tình, 1-2 sao dài hơn và cụ thể hơn
// (khớp khảo sát thực tế: review 1 sao dài gấp ~4 lần review 5 sao).

const OPENERS: Record<number, string[]> = {
  5: ["Tuyệt vời!", "Xuất sắc.", "Quá ngon.", "Rất hài lòng.", "Đáng đồng tiền."],
  4: ["Khá ổn.", "Ngon, đáng thử.", "Hài lòng.", "Ấn tượng tốt."],
  3: ["Tạm ổn.", "Bình thường.", "Ổn, không có gì đặc biệt.", "Được, nhưng chưa xuất sắc."],
  2: ["Hơi thất vọng.", "Chưa đạt kỳ vọng.", "Không như mong đợi."],
  1: ["Rất thất vọng.", "Trải nghiệm tệ.", "Không hài lòng chút nào."],
};

const DISH_COMMENTS: Record<number, string[]> = {
  5: [
    "{dish} được nướng đúng độ chín mình gọi, thịt mềm và mọng nước.",
    "{dish} chuẩn vị, trình bày đẹp mắt, đúng như hình quảng cáo.",
    "{dish} là món ngon nhất mình từng ăn ở phân khúc nhà hàng cao cấp.",
  ],
  4: [
    "{dish} ngon, chỉ hơi mặn một chút so với khẩu vị của mình.",
    "{dish} được, thịt mềm nhưng sốt hơi nhạt.",
    "{dish} ổn, phần ăn khá đầy đặn so với giá.",
  ],
  3: [
    "{dish} tạm được nhưng không có gì nổi bật so với các nhà hàng cùng tầm giá.",
    "{dish} ăn được, nhưng chờ hơi lâu mới lên món.",
  ],
  2: [
    "{dish} bị chín quá so với yêu cầu, nhân viên xin lỗi nhưng không đổi món khác.",
    "{dish} nguội khi mang ra, chắc do bếp đông khách.",
  ],
  1: [
    "{dish} order rồi chờ gần 1 tiếng mới có, đến lúc ăn thì nguội ngắt.",
    "{dish} không đúng độ chín yêu cầu, gọi phục vụ 3 lần mới được xử lý.",
  ],
};

const CLOSERS: Record<number, string[]> = {
  5: ["Chắc chắn sẽ quay lại.", "Sẽ giới thiệu cho bạn bè.", "5 sao xứng đáng.", "Rất đáng để đặt bàn trước."],
  4: ["Vẫn sẽ quay lại lần sau.", "Nhìn chung là một trải nghiệm tốt.", "Đáng thử ít nhất một lần."],
  3: ["Có thể cân nhắc quay lại nếu có dịp.", "Không tệ nhưng cũng không xuất sắc."],
  2: ["Cân nhắc kỹ trước khi quay lại.", "Hy vọng nhà hàng cải thiện chất lượng."],
  1: ["Không nghĩ sẽ quay lại.", "Rất mong nhà hàng xem lại quy trình phục vụ."],
};

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function generateReviewContent(rating: number, dishName: string, rng: () => number): string {
  const opener = pick(rng, OPENERS[rating]);
  const detail = pick(rng, DISH_COMMENTS[rating]).replace("{dish}", dishName);
  const closer = pick(rng, CLOSERS[rating]);
  return `${opener} ${detail} ${closer}`;
}
