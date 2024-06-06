document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signup-form");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = signupForm.elements["email"].value;
    const password = signupForm.elements["password"].value;

    // Send signup data to the server
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to sign up");
        }
        return response.json();
      })
      .then((data) => {
        // Signup successful, handle response data (if needed)
        console.log("Signup successful:", data);
        // Redirect to dashboard or another page
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        // Handle signup error
        console.error("Signup error:", error.message);
        // Display error message to the user (if needed)
      });
  });
});
