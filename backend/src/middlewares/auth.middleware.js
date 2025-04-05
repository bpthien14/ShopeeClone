const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
  try {
    // Kiểm tra token trong header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Bạn chưa đăng nhập',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra user còn tồn tại không
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        message: 'Token không hợp lệ',
      });
    }

    // Gán user vào request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token không hợp lệ',
      error: error.message,
    });
  }
};

// Middleware kiểm tra role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.some(role => req.user.roles.includes(role))) {
      return res.status(403).json({
        message: 'Bạn không có quyền thực hiện hành động này',
      });
    }
    next();
  };
}; 