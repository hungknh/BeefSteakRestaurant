// Sinh tên khách hàng Việt Nam giả — họ + tên đệm + tên riêng phổ biến, ghép ngẫu
// nhiên nhưng có chủ đích tránh trùng lặp lộ liễu (không dùng chung 1 khuôn "Nguyễn Văn A").

const FAMILY_NAMES = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ",
  "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Đoàn",
];

const MIDDLE_NAMES_MALE = ["Văn", "Hữu", "Minh", "Thanh", "Xuân", "Gia", "Anh", "Quốc", "Đình"];
const MIDDLE_NAMES_FEMALE = ["Thị", "Ngọc", "Thanh", "Thu", "Xuân", "Gia", "Anh", "Kim", "Hồng"];

const GIVEN_NAMES_MALE = [
  "Anh", "Bảo", "Cường", "Dũng", "Đạt", "Duy", "Hải", "Hoàng", "Huy", "Khang",
  "Khánh", "Kiên", "Long", "Minh", "Nam", "Phúc", "Phong", "Quân", "Sơn", "Thắng",
  "Thịnh", "Tuấn", "Trung", "Vinh", "Việt",
];
const GIVEN_NAMES_FEMALE = [
  "An", "Anh", "Chi", "Diễm", "Dung", "Hà", "Hằng", "Hoa", "Huyền", "Lan",
  "Linh", "Mai", "My", "Ngân", "Ngọc", "Nhi", "Phương", "Quyên", "Thảo", "Thư",
  "Trang", "Trâm", "Uyên", "Vân", "Yến",
];

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function stripDiacritics(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export type GeneratedPerson = { name: string; email: string; phone: string };

/** Sinh danh sách `count` khách hàng giả, email đảm bảo duy nhất. */
export function generateCustomers(count: number, seedRng: () => number): GeneratedPerson[] {
  const usedEmails = new Set<string>();
  const people: GeneratedPerson[] = [];

  for (let i = 0; i < count; i++) {
    const isFemale = seedRng() < 0.5;
    const family = pick(seedRng, FAMILY_NAMES);
    const middle = pick(seedRng, isFemale ? MIDDLE_NAMES_FEMALE : MIDDLE_NAMES_MALE);
    const given = pick(seedRng, isFemale ? GIVEN_NAMES_FEMALE : GIVEN_NAMES_MALE);
    const name = `${family} ${middle} ${given}`;

    const emailBase = stripDiacritics(`${given}.${family}`).toLowerCase().replace(/\s+/g, "");
    let email = `${emailBase}@example.com`;
    let suffix = 1;
    while (usedEmails.has(email)) {
      suffix += 1;
      email = `${emailBase}${suffix}@example.com`;
    }
    usedEmails.add(email);

    const phonePrefixes = ["03", "05", "07", "08", "09"];
    const prefix = pick(seedRng, phonePrefixes);
    const rest = Array.from({ length: 8 }, () => Math.floor(seedRng() * 10)).join("");
    const phone = `${prefix}${rest}`;

    people.push({ name, email, phone });
  }

  return people;
}
