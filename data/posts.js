const fs = require('fs/promises');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'posts.json');

// Ensure posts.json exists
async function ensureFileExists() {
  try {
    await fs.access(FILE_PATH);
  } catch (error) {
    console.log('posts.json not found, creating...');
    await fs.writeFile(FILE_PATH, JSON.stringify({ posts: [] }, null, 2));
  }
}

// Get stored posts
async function getStoredPosts() {
  try {
    await ensureFileExists();
    const rawFileContent = await fs.readFile(FILE_PATH, { encoding: 'utf-8' });
    console.log('Reading posts.json:', rawFileContent); // Debugging log
    const data = JSON.parse(rawFileContent);
    return data.posts || [];
  } catch (error) {
    console.error('❌ Error reading posts.json:', error);
    return [];
  }
}

// Store new posts
async function storePosts(posts) {
  try {
    console.log('Saving to posts.json:', JSON.stringify({ posts }, null, 2)); // Debugging log
    await fs.writeFile(FILE_PATH, JSON.stringify({ posts }, null, 2));
    console.log('✅ Successfully saved to posts.json');
  } catch (error) {
    console.error('❌ Error writing to posts.json:', error);
  }
}

// Update a post by ID
async function updatePost(id, updatedData) {
  try {
    const storedPosts = await getStoredPosts();
    const postIndex = storedPosts.findIndex((post) => post.id === id);
    if (postIndex === -1) throw new Error('Post not found');

    storedPosts[postIndex] = { ...storedPosts[postIndex], ...updatedData };
    await storePosts(storedPosts);
  } catch (error) {
    console.error('❌ Error updating post:', error);
    throw error;
  }
}

// Delete a post by ID
async function deletePost(id) {
  try {
    const storedPosts = await getStoredPosts();
    const filteredPosts = storedPosts.filter((post) => post.id !== id);
    await storePosts(filteredPosts);
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    throw error;
  }
}

module.exports = {
  getStoredPosts,
  storePosts,
  updatePost,
  deletePost
};
