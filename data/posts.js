const fs = require('node:fs/promises');

const FILE_PATH = 'posts.json';

// Helper function to ensure posts.json exists
async function ensureFileExists() {
  try {
    await fs.access(FILE_PATH);
  } catch (error) {
    // If file doesn't exist, create an empty one
    await fs.writeFile(FILE_PATH, JSON.stringify({ posts: [] }));
  }
}

async function getStoredPosts() {
  try {
    await ensureFileExists();
    const rawFileContent = await fs.readFile(FILE_PATH, { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    return data.posts ?? [];
  } catch (error) {
    console.error('Error reading posts.json:', error);
    return [];
  }
}

async function storePosts(posts) {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify({ posts: posts || [] }));
  } catch (error) {
    console.error('Error writing to posts.json:', error);
  }
}

async function updatePost(id, updatedData) {
  try {
    const storedPosts = await getStoredPosts();
    const postIndex = storedPosts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    storedPosts[postIndex] = { ...storedPosts[postIndex], ...updatedData };
    await storePosts(storedPosts);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error; // Rethrow to handle in the route
  }
}

async function deletePost(id) {
  try {
    const storedPosts = await getStoredPosts();
    const filteredPosts = storedPosts.filter((post) => post.id !== id);
    await storePosts(filteredPosts);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

module.exports = {
  getStoredPosts,
  storePosts,
  updatePost,
  deletePost
};
