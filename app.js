const express = require('express');
const bodyParser = require('body-parser');
const { getStoredPosts, storePosts, updatePost, deletePost } = require('./data/posts');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/posts', async (req, res) => {
  const storedPosts = await getStoredPosts();
  res.json({ posts: storedPosts });
});

app.get('/posts/:id', async (req, res) => {
  const storedPosts = await getStoredPosts();
  const post = storedPosts.find((post) => post.id === req.params.id);
  res.json({ post });
});

app.post('/posts', async (req, res) => {
  const existingPosts = await getStoredPosts();
  const postData = req.body;
  const newPost = {
    ...postData,
    id: Math.random().toString(),
  };
  const updatedPosts = [newPost, ...existingPosts];
  await storePosts(updatedPosts);
  res.status(201).json({ message: 'Stored new post.', post: newPost });
});

app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    await updatePost(id, updatedData);
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deletePost(id);
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.listen(8080);
