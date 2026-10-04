async function openWalletItem(id) {
  try {
    const file = await getWalletFile(id);

    if (!file || !file.blob) {
      alert("This file could not be found in the Travel Wallet.");
      return;
    }

    const url = URL.createObjectURL(file.blob);

    if (
      file.category === "photo" ||
      (file.type && file.type.startsWith("image/"))
    ) {
      showWalletViewer(
        file.name,
        `<img src="${url}" class="wallet-view-image">`,
        url
      );
      return;
    }

    if (file.type === "application/pdf") {
      showWalletViewer(
        file.name,
        `<iframe src="${url}" class="wallet-view-pdf"></iframe>`,
        url
      );
      return;
    }

    window.location.href = url;

  } catch (error) {
    console.error("Wallet open error:", error);
    alert("My Travel could not open this file.");
  }
}

function showWalletViewer(title, content, objectURL) {
  const viewer = document.createElement("div");
  viewer.className = "wallet-viewer";

  viewer.innerHTML = `
    <div class="wallet-viewer-header">
      <button class="wallet-close-button">Done</button>
      <strong>${escapeHTML(title)}</strong>
      <span></span>
    </div>

    <div class="wallet-viewer-content">
      ${content}
    </div>
  `;

  document.body.appendChild(viewer);

  viewer
    .querySelector(".wallet-close-button")
    .addEventListener("click", () => {
      viewer.remove();
      URL.revokeObjectURL(objectURL);
    });
}

async function renameWalletItem(id) {
  const file = await getWalletFile(id);

  if (!file) return;

  const newName = prompt(
    "Rename this item:",
    file.name
  );

  if (!newName || !newName.trim()) return;

  file.name = newName.trim();

  await saveWalletFile(file);
  await wallet();
}

async function removeWalletItem(id) {
  const file = await getWalletFile(id);

  if (!file) return;

  const confirmed = confirm(
    `Delete "${file.name}" from this device?`
  );

  if (!confirmed) return;

  await deleteWalletFile(id);
  await wallet();
}
