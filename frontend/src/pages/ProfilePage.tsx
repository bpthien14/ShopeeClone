import { useAuth } from '../contexts/AuthContext';
import './ProfilePage.css';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Thông tin cá nhân</h2>
        <div className="profile-info">
          <div className="info-group">
            <label>Email</label>
            <p>{user?.email}</p>
          </div>
          <div className="info-group">
            <label>Họ tên</label>
            <p>{user?.name}</p>
          </div>
          <div className="info-group">
            <label>Số điện thoại</label>
            <p>{user?.phone || 'Chưa cập nhật'}</p>
          </div>
          <div className="info-group">
            <label>Địa chỉ</label>
            <p>{user?.address || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <button className="edit-button">
          Chỉnh sửa thông tin
        </button>
      </div>
    </div>
  );
}; 