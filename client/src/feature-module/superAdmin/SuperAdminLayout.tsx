import { Outlet } from 'react-router';

const SuperAdminLayout = () => {
  return (
    <div className="container-fluid">
      <div className="row vh-100">
        <div className="col-12 d-flex flex-column">
          <main className="flex-grow-1 p-4 bg-light">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;

