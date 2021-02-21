export async function getPublications(filters) {
  let API = process.env.NEXT_PUBLIC_API;
  let data;
  try {
    let res = await fetch(API + "/publications", {
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
