import { Outlet, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { clearSuperAdminAuth } from '../../core/data/redux/superAdminAuthSlice';
import { superAdminApiService } from '../../core/services/superAdminApiService';

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await superAdminApiService.logout();
    } catch {
      // Server cookie clear is best-effort; always drop client session.
    }
    dispatch(clearSuperAdminAuth());
    navigate('/super-admin/login', { replace: true });
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        <div className="col-12 d-flex flex-column">
          <header className="d-flex justify-content-end align-items-center py-2 px-3 border-bottom bg-white">
            <button
              type="button"
              className="btn btn-primary btn-lg px-4 fw-semibold text-white shadow-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </header>
          <main className="flex-grow-1 p-4 bg-light">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;

