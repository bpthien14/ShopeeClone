const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email đã được sử dụng',
      });
    }

    // Tạo user mới
    const user = await User.create({
      email,
      password,
      name,
      phone,
      address,
    });

    // Tạo token
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        roles: user.roles,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Có lỗi xảy ra khi đăng ký',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Tạo token
    const token = generateToken(user._id);

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        roles: user.roles,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Có lỗi xảy ra khi đăng nhập',
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Có lỗi xảy ra khi lấy thông tin người dùng',
      error: error.message,
    });
  }
}; 