import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase credentials
const isSupabaseConfigured = () => {
  const configured =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://demo.supabase.co" &&
    supabaseAnonKey !==
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

  console.log("Supabase Configuration Check:", {
    supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    isConfigured: configured,
  });

  return configured;
};

// Demo data storage
const demoUsers = new Map();
const demoContacts: any[] = [];
const demoApplications: any[] = [];
let currentUser: any = null;

// Create a mock client if environment variables are not set or are demo values
const createSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    console.warn(
      "⚠️ Supabase not configured. Please add your credentials to enable full functionality.",
    );

    // Return a comprehensive mock client with demo functionality
    return {
      auth: {
        getSession: () =>
          Promise.resolve({
            data: { session: currentUser ? { user: currentUser } : null },
            error: null,
          }),
        signInWithPassword: ({ email, password }: any) => {
          const user = demoUsers.get(email);
          if (user && user.password === password) {
            currentUser = user;
            setTimeout(() => window.location.reload(), 100); // Trigger auth state change
            return Promise.resolve({
              data: { user: currentUser, session: { user: currentUser } },
              error: null,
            });
          }
          return Promise.resolve({
            data: { user: null, session: null },
            error: {
              message:
                "Invalid email or password (Demo Mode - Try creating an account first)",
            },
          });
        },
        signUp: ({ email, password, options }: any) => {
          if (demoUsers.has(email)) {
            return Promise.resolve({
              data: { user: null, session: null },
              error: { message: "User already exists (Demo Mode)" },
            });
          }

          const newUser = {
            id: `demo-${Date.now()}`,
            email,
            password,
            user_metadata: options?.data || {},
            created_at: new Date().toISOString(),
          };

          demoUsers.set(email, newUser);
          currentUser = newUser;

          // Auto-login after signup
          setTimeout(() => window.location.reload(), 100);
          return Promise.resolve({
            data: { user: newUser, session: { user: newUser } },
            error: null,
          });
        },
        signInWithOAuth: () =>
          Promise.resolve({
            data: { url: null, provider: null },
            error: {
              message:
                "OAuth not available in demo mode. Use email signup/login instead.",
            },
          }),
        signOut: () => {
          currentUser = null;
          setTimeout(() => window.location.reload(), 100);
          return Promise.resolve({ error: null });
        },
        onAuthStateChange: (callback: any) => {
          // Call the callback immediately with current session
          setTimeout(() => {
            try {
              callback(
                currentUser ? "SIGNED_IN" : "SIGNED_OUT",
                currentUser ? { user: currentUser } : null,
              );
            } catch (error) {
              console.warn("Mock auth state change callback error:", error);
            }
          }, 0);
          return {
            data: {
              subscription: {
                unsubscribe: () => {
                  console.log("Mock auth subscription unsubscribed");
                },
              },
            },
          };
        },
      },
      from: (table: string) => ({
        insert: (data: any) => {
          const record = {
            id: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...data[0],
            created_at: new Date().toISOString(),
          };

          if (table === "contacts") {
            demoContacts.push(record);
          } else if (table === "job_applications") {
            demoApplications.push(record);
          } else if (table === "users") {
            // Handle user profile upsert
            return Promise.resolve({ data: [record], error: null });
          }

          return Promise.resolve({ data: [record], error: null });
        },
        select: (columns: string = "*") => ({
          order: (column: string, options?: any) => {
            let data: any[] = [];
            if (table === "contacts") {
              data = [...demoContacts];
            } else if (table === "job_applications") {
              data = [...demoApplications];
            }

            // Sort by created_at descending if that's the order
            if (column === "created_at" && options?.ascending === false) {
              data.sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              );
            }

            return Promise.resolve({ data, error: null });
          },
        }),
        update: (updateData: any) => ({
          eq: (column: string, value: any) => {
            if (table === "job_applications") {
              const app = demoApplications.find((a) => a.id === value);
              if (app) {
                Object.assign(app, updateData);
                return Promise.resolve({ data: [app], error: null });
              }
            }
            return Promise.resolve({
              data: null,
              error: { message: "Record not found" },
            });
          },
        }),
        upsert: (data: any) => {
          // For user profiles
          if (table === "users") {
            return Promise.resolve({ data: [data], error: null });
          }
          return Promise.resolve({ data: [data], error: null });
        },
      }),
      storage: {
        from: () => ({
          upload: (path: string, file: File) => {
            // Simulate file upload by creating a demo URL
            const demoUrl = `demo-storage/${file.name}-${Date.now()}`;
            return Promise.resolve({
              data: { path: demoUrl },
              error: null,
            });
          },
          getPublicUrl: (path: string) => ({
            data: { publicUrl: `https://demo-storage.example.com/${path}` },
          }),
        }),
      },
    };
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
};

export const supabase = createSupabaseClient() as any;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          message?: string;
        };
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string;
          position: string;
          experience: string;
          resume_url: string | null;
          cover_letter: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          full_name: string;
          email: string;
          phone: string;
          position: string;
          experience: string;
          resume_url?: string | null;
          cover_letter?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string;
          position?: string;
          experience?: string;
          resume_url?: string | null;
          cover_letter?: string | null;
          status?: string;
        };
      };
      get_started_requests: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          company: string | null;
          phone: string | null;
          job_title: string | null;
          message: string | null;
          created_at: string;
        };
        Insert: {
          first_name: string;
          last_name: string;
          email: string;
          company?: string | null;
          phone?: string | null;
          job_title?: string | null;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          company?: string | null;
          phone?: string | null;
          job_title?: string | null;
          message?: string | null;
        };
      };
      resume_uploads: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          location: string | null;
          position_interested: string | null;
          experience_level: string | null;
          skills: string | null;
          cover_letter: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          resume_url: string | null;
          created_at: string;
        };
        Insert: {
          full_name: string;
          email: string;
          phone?: string | null;
          location?: string | null;
          position_interested?: string | null;
          experience_level?: string | null;
          skills?: string | null;
          cover_letter?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          resume_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          location?: string | null;
          position_interested?: string | null;
          experience_level?: string | null;
          skills?: string | null;
          cover_letter?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          resume_url?: string | null;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          is_active: boolean;
        };
        Insert: {
          email: string;
          subscribed_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          is_active?: boolean;
        };
      };
    };
  };
};
