// server/index.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();


app.use(cors());
app.use(express.json());





app.get('/api/users', async (req, res) => {
  
  try {
    const result = await pool.query('SELECT * FROM users'); // assuming a 'users' table
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {

    const result = await pool.query('SELECT * FROM users WHERE id = $1 ',
      [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.put('/api/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email, gender } = req.body;

    try {
        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, gender = $3 WHERE id = $4 RETURNING *',
            [name, email, gender, userId]
        );

        res.status(200).json(result.rows[0]); // Send back the updated user
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).send('Server error');
    }
});

app.post('/api/users', async (req, res) => {


  try {
    const { id, name, email, gender } = req.body;

    if ( !name || !email || !gender) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    // Insert the user into the database
    const result = await pool.query(
      'INSERT INTO users (name, email, gender) VALUES ($1, $2, $3) RETURNING *',
      [ name, email, gender]
    );

    // Send the inserted user as a response
    res.status(201).json(result.rows[0]);  // Send the inserted user back in response
  } catch (err) {
    console.log(req.body);
    console.log(err);
    res.status(500).send('Server error');
  }
});

app.delete('/api/users/:id', async (req, res) => {
  
  try {
   const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ msg: 'Id required fields' });
    }
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
     if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Send the inserted user as a response
     res.status(200).json({ msg: 'User deleted', user: result.rows[0] });

  }
  catch (err) {
    console.log(req.body);
    console.log(err);
    res.status(500).send('Server error');
  }

});



const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});