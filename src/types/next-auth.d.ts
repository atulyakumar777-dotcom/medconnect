import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string | null;
      doctorId?: string | null;
    };
  }

  interface User {
    role: string;
    doctorId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
    doctorId?: string | null;
  }
}
