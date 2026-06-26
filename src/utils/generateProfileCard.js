export async function generateProfileCard({
  user,
  stats,
  rank,
  totalPlayers
}) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 900;

  const ctx = canvas.getContext("2d");

  const template = await loadImage("/profile-card-template.png");
  ctx.drawImage(template, 0, 0, 1600, 900);


  const today = new Date()
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    })
    .toUpperCase();

  await drawAvatar(ctx, user);
  drawText(ctx, user, stats, rank, totalPlayers, today);

  const link = document.createElement("a");
  link.download = `${user.name}-profile-card.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function getProfileImageUrl(image) {
  if (!image) return null;

  if (image.startsWith("http")) return image;

  return `https://backend.minershub.online/fifa${image}`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function drawAvatar(ctx, user) {
  const profileImage = getProfileImageUrl(user.profile_image);

  const x = 158;
  const y = 279;
  const r = 76;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();

  if (profileImage) {
    try {
      const avatar = await loadImage(profileImage);
      ctx.drawImage(avatar, x - r, y - r, r * 2, r * 2);
      ctx.restore();
      return;
    } catch (error) {
      console.error("Avatar failed to load:", error);
    }
  }

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 72px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(user.name[0].toUpperCase(), x, y + 4);

  ctx.restore();
}



function drawText(ctx, user, stats, rank, totalPlayers, today) {
  const totalPredictions = stats.predictions || stats.total_predictions || 0;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 64px Arial";
  ctx.fillText(user.name, 260, 265);

ctx.font = "600 22px Arial";
ctx.fillText(`${rank || "?"}`, 365, 320);

ctx.font = "600 24px Arial";
ctx.fillText(
  `·  ${rank || "?"} / ${totalPlayers || "?"} PLAYERS`,
  430,
  320
);

  // Accuracy
  const accuracyText = `${Number(stats.accuracy || 0).toFixed(1)}`;

  ctx.fillStyle = "#f71946";
  ctx.textAlign = "center";
  ctx.font = "700 78px Arial";
  ctx.fillText(accuracyText, 282, 510);

  ctx.font = "600 48px Arial";
  ctx.fillText("%", 375, 510);

  // Close scores
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 78px Arial";
  ctx.fillText(`${stats.close || 0}`, 604, 510);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "600 26px Arial";
  ctx.fillText(`/${totalPredictions}`, 680, 510);

  // Perfect scores
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 78px Arial";
  ctx.fillText(`${stats.perfect || 0}`, 285, 705);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "600 26px Arial";
  ctx.fillText(`/${totalPredictions}`, 345, 705);

  // Total points
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 78px Arial";
  ctx.fillText(`${user.points || 0}`, 625, 705);

  // Footer date only, template already has REDSTONE MINERS
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "500 20px monospace";
  ctx.fillText(`·   ${today}`, 285, 824);
}