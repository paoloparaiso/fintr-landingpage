import { createClient } from "@supabase/supabase-js";

// Mock supabase client that maintains the interface
export const supabase = {
  from: (table) => ({
    select: (columns) => {
      const baseResponse = {
        eq: (column, value) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: (column, options) => Promise.resolve({ data: [], error: null }),
          delete: () => Promise.resolve({ data: null, error: null }),
          update: (data) => ({
            eq: (column, value) => ({
              select: () => Promise.resolve({ data: [], error: null }),
            }),
          }),
          insert: (items) => ({
            select: () => Promise.resolve({ data: [items[0]], error: null }),
          }),
          gte: (column, value) => ({
            lte: (column, value) => Promise.resolve({ data: [], error: null }),
            order: (column, options) => Promise.resolve({ data: [], error: null }),
          }),
          lt: (column, value) => ({
            gte: (column, value) => ({
              lte: (column, value) => Promise.resolve({ data: [], error: null }),
            }),
          }),
        }),
        order: (column, options) => Promise.resolve({ data: [], error: null }),
        gte: (column, value) => ({
          lte: (column, value) => Promise.resolve({ data: [], error: null }),
          order: (column, options) => Promise.resolve({ data: [], error: null }),
        }),
        lt: (column, value) => ({
          gte: (column, value) => ({
            lte: (column, value) => Promise.resolve({ data: [], error: null }),
          }),
        }),
        lte: (column, value) => Promise.resolve({ data: [], error: null }),
      };
      return baseResponse;
    },
    insert: (items) => ({
      select: () => Promise.resolve({ data: [items[0]], error: null }),
    }),
    update: (data) => ({
      eq: (column, value) => ({
        select: () => Promise.resolve({ data: [data], error: null }),
      }),
    }),
    delete: () => ({
      eq: (column, value) => Promise.resolve({ data: null, error: null }),
    }),
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
};
