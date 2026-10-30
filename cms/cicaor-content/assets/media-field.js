// Image picker for the plugin's image fields, using the WordPress media library.
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cicaor-media]");
  if (!button) return;
  event.preventDefault();

  const field = button.closest(".cicaor-media");
  const input = field.querySelector("input");
  const preview = field.querySelector("img");

  if (button.dataset.cicaorMedia === "remove") {
    input.value = "";
    preview.hidden = true;
    return;
  }

  const frame = wp.media({ title: "Kép kiválasztása", library: { type: "image" }, multiple: false });
  frame.on("select", () => {
    const attachment = frame.state().get("selection").first().toJSON();
    input.value = attachment.id;
    preview.src = attachment.sizes?.medium?.url ?? attachment.url;
    preview.hidden = false;
  });
  frame.open();
});
