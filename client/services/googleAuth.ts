// Google OAuth configuration and methods
// Note: This requires proper setup in Google Cloud Console

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export class GoogleAuthService {
  private static clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "demo-client-id";

  static async initialize(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  static async signIn(): Promise<GoogleUser | null> {
    try {
      await this.initialize();

      return new Promise((resolve, reject) => {
        if (typeof window !== "undefined" && (window as any).google) {
          (window as any).google.accounts.id.initialize({
            client_id: this.clientId,
            callback: (response: any) => {
              try {
                // Decode JWT token to get user info
                const decoded = this.parseJwt(response.credential);
                const user: GoogleUser = {
                  id: decoded.sub,
                  email: decoded.email,
                  name: decoded.name,
                  picture: decoded.picture,
                };
                resolve(user);
              } catch (error) {
                reject(error);
              }
            },
          });

          (window as any).google.accounts.id.prompt((notification: any) => {
            if (
              notification.isNotDisplayed() ||
              notification.isSkippedMoment()
            ) {
              // Fallback to popup
              (window as any).google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                {
                  theme: "outline",
                  size: "large",
                  width: "100%",
                },
              );
            }
          });
        } else {
          reject(new Error("Google SDK not loaded"));
        }
      });
    } catch (error) {
      console.error("Google Sign-In error:", error);
      throw error;
    }
  }

  private static parseJwt(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  static signOut(): void {
    if (typeof window !== "undefined" && (window as any).google) {
      (window as any).google.accounts.id.disableAutoSelect();
    }
    // Clear any stored tokens/user data
    localStorage.removeItem("google_user");
  }
}
