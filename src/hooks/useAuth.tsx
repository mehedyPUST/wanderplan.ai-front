"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wanderplan-ai-back.vercel.app';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/user/profile`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}