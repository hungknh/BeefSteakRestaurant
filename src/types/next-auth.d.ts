import type { DefaultSession } from "@auth/core/types";
import type { Role } from "@/types";

// next-auth v5 re-export `Session`/`User`/`JWT` từ @auth/core (`export type { Session } from "@auth/core/types"`)
// — augment thẳng "next-auth" không merge được vào type gốc, phải augment đúng module @auth/core.
declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
