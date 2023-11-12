export const baseUrl = "https://chatapp-api-cyzp.onrender.com/api";

export const postRequest = async (url: string, body: BodyInit) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await response.json();
  if (!response.ok) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return { error: true, message };
  }
  return data;
};

export const getRequest = async (url: string) => {
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    let message = "An error occurred...";

    if (data?.message) {
      message = data.message;
    }

    return { error: true, message };
  }

  return data;
};
