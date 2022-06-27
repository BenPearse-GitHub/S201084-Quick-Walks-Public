// sign in api, requires login details
async function signIn(loginDetails) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/accounts/sign-in`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    }
  );
  return response;
}

// sign up api, requires new user info
async function signUp(newUserInfo) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/accounts/sign-up`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserInfo),
    }
  );
  return response;
}

export { signIn, signUp };
