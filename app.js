import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://lrvkoqjfbrqzgwzqgdur.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydmtvcWpmYnJxemd3enFnZHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Mjc5NzUsImV4cCI6MjA4MjEwMzk3NX0.h7FdeAHsyyr-lhZcLJ5dO7_XundgeJPaB7lHu_vJzH8";

const supabase = createClient(supabaseUrl, supabaseKey);
const bucketName = "slop-wall"; // adjust if different
const folders = ["Images", "Videos"];
const wall = document.getElementById("wall");

function shuffleArray(array) {
  return array.map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
}

async function fetchFiles(folder, type) {
  const { data, error } = await supabase.storage.from(bucketName).list(folder);
  if (error) {
    console.error(`Error loading ${folder}:`, error);
    return [];
  }

  return data.map(file => ({
    type,
    url: `${supabaseUrl}/storage/v1/object/public/${bucketName}/${folder}/${file.name}`
  }));
}

async function loadWall() {
  const imageFiles = await fetchFiles("Images", "image");
  const videoFiles = await fetchFiles("Videos", "video");

  const allFiles = shuffleArray([...imageFiles, ...videoFiles]);

  wall.innerHTML = allFiles.map(file => {
    return file.type === "video"
      ? `<video src="${file.url}" autoplay muted loop playsinline></video>`
      : `<img src="${file.url}" alt="slop image">`;
  }).join("");
}

loadWall();
