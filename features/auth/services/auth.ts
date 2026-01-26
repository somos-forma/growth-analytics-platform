import type { Auth } from "../types/auth.type";

export const loginAuth = async (data: Auth): Promise<Auth> => {
  try {
    const response = await fetch("https://auton8n.moovmediagroup.com/webhook/growth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.status === "404") {
      throw new Error(result.message);
    } else {
      localStorage.setItem("userEmail", data.email);
      const loginconfirm: Auth = result;
      console.log(loginconfirm);
      return loginconfirm;
    }
  } catch (error) {
    console.error("Error al iniciar sesión", error);
    throw error;
  }
};
