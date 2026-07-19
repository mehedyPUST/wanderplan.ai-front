"use client";

import { useEffect, useState, useRef } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://wanderplan-ai-back.vercel.app';

let cachedUser: User | null = null;
let fetchPromise: Promise<any> | null = null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!cachedUser);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    if (fetchPromise) {
      fetchPromise.then(setUser).finally(() => setLoading(false));
      return;
    }

    fetchPromise = fetch(`${API_URL}/api/user/profile`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        cachedUser = data;
        setUser(data);
      })
      .catch(() => {
        cachedUser = null;
        setUser(null);
      })
      .finally(() => setLoading(false));

    fetchPromise.then((data) => {
      if (data) setUser(data);
    });
  }, []);

  return { user, loading };
}
