const fs = require('node:fs/promises');
const FILE_PATH = 'post.json'; // Make sure this matches your file name

async function getStoredPosts() {
  try {
    const rawFileContent = await fs.readFile(FILE_PATH, { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    return data.posts || []; // Ensure it returns an array
  } catch (error) {
    console.error('Error reading post.json:', error);
    return []; // Return empty array if file not found
  }
}

async function storePosts(posts) {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify({ posts: posts || [] }, null, 2));
  } catch (error) {
    console.error('Error writing to post.json:', error);
  }
}

async function updatePost(id, updatedData) {
  const storedPosts = await getStoredPosts();
  const postIndex = storedPosts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    throw new Error('Post not found');
  }
  storedPosts[postIndex] = { ...storedPosts[postIndex], ...updatedData };
  await storePosts(storedPosts);
}

async function deletePost(id) {
  const storedPosts = await getStoredPosts();
  const filteredPosts = storedPosts.filter((post) => post.id !== id);
  await storePosts(filteredPosts);
}

module.exports = { getStoredPosts, storePosts, updatePost, deletePost };
