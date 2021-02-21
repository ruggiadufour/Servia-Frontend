export async function getUsers(filters) {
  let API = process.env.NEXT_PUBLIC_API;
  let data;
  try {
    let res = await fetch(API + "/public-users", {
      method: "POST",
      body: JSON.stringify(filters),
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}
