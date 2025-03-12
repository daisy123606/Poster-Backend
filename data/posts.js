const fs = require('node:fs/promises');

async function getStoredPosts() {
  const rawFileContent = await fs.readFile('posts.json', {
    encoding: 'utf-8',
  });
  const data = JSON.parse(rawFileContent);
  const storedPosts = data.posts ?? [];
  return storedPosts;
}

function storePosts(posts) {
  return fs.writeFile('posts.json', JSON.stringify({ posts: posts || [] }));
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

exports.getStoredPosts = getStoredPosts;
exports.storePosts = storePosts;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
