'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

// Simple in-memory cache to avoid redundant lookups during a session
const nameCache: Record<string, string> = {};

export function useUserName(walletAddress: string | undefined) {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    
    const addr = walletAddress.toLowerCase();
    
    if (nameCache[addr]) {
      setName(nameCache[addr]);
      return;
    }

    async function fetchName() {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'users'),
          where('walletAddress', '==', addr),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fetchedName = querySnapshot.docs[0].data().name;
          nameCache[addr] = fetchedName;
          setName(fetchedName);
        } else {
          // If no record exists, we don't store in cache to allow for future updates
          setName(null);
        }
      } catch (error) {
        console.error("Error fetching username from Firestore:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchName();
  }, [walletAddress]);

  const shortenedAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
    : '...';

  const displayName = name || shortenedAddress;
  
  return { displayName, loading };
}