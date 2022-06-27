import jwtDecode from "jwt-decode";

// get username api, requires userId
async function getUsernameById(userId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/users/${userId}/username`
  );
  return response;
}

// get all bookmarks api, requires token
async function getAllBookmarks(token) {
  const user = jwtDecode(token);
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/users/${user._id}/bookmarks`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    }
  );
  return response;
}

// add bookmark api, requires token and routeId
async function addBookmark(args) {
  const user = jwtDecode(args.token);
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/users/${user._id}/bookmarks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": args.token,
      },
      body: JSON.stringify({
        routeId: args.routeId,
      }),
    }
  );
  return response;
}

// check bookmark exists api, requires token and routeId
async function checkBookmarkExists(args) {
  const user = jwtDecode(args.token);
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/users/${user._id}/bookmarks/${args.routeId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": args.token,
      },
    }
  );
  return response;
}

// remove bookmark api, requires token and routeId
async function removeBookmark(args) {
  const user = jwtDecode(args.token);
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/users/${user._id}/bookmarks/${args.routeId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": args.token,
      },
    }
  );
  return response;
}

export {
  getUsernameById,
  getAllBookmarks,
  addBookmark,
  checkBookmarkExists,
  removeBookmark,
};
