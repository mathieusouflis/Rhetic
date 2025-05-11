import { API_CONFIG } from "@/config";

export const updateWithoutAxios = async <T>(
  url: string,
  id: string,
  data: Record<string, any>
) => {
  let response = await fetch(API_CONFIG.baseURL + url + "/" + id, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
    }),
  });
  return await response.json();
};
