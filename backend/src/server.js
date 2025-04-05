const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/auth.routes');

// Khởi tạo express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Kết nối MongoDB
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Kết nối MongoDB thành công');
    // Khởi động server
    app.listen(config.PORT, () => {
      console.log(`Server đang chạy trên port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }); 