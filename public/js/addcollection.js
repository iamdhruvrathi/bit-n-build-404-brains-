document
  .getElementById("addCollectionForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const response = await fetch("/api/collections", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Collection item added successfully!");
      // Redirect or reset the form as needed
      window.location.href = "/collections"; // Redirect to collections page
    } else {
      alert("Error adding collection item.");
    }
  });
