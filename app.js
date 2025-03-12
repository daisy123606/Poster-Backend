const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const { getStoredPosts, storePosts, updatePost, deletePost } = require('./data/posts');

const app = express();

// Enable CORS for all requests
app.use(cors());

app.use(bodyParser.json());

app.get('/posts', async (req, res) => {
  try {
    const storedPosts = await getStoredPosts();
    res.json({ posts: storedPosts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const storedPosts = await getStoredPosts();
    const post = storedPosts.find((post) => post.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post' });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const existingPosts = await getStoredPosts();
    const postData = req.body;
    const newPost = { ...postData, id: Math.random().toString() };
    const updatedPosts = [newPost, ...existingPosts];
    await storePosts(updatedPosts);
    res.status(201).json({ message: 'Stored new post.', post: newPost });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store post' });
  }
});

app.put('/posts/:id', async (req, res) => {
  try {
    await updatePost(req.params.id, req.body);
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    await deletePost(req.params.id);
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Use Vercel's provided PORT
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
