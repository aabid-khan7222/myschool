import { all_routes } from '../../../router/all_routes'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../../core/data/redux/authSlice'
import { getDashboardForRole } from '../../../../core/utils/roleUtils'

interface StudentBreadcrumbProps {
  studentId?: number | string
}

const StudentBreadcrumb = ({ studentId }: StudentBreadcrumbProps) => {
  const routes = all_routes
  const user = useSelector(selectUser)
  const role = user?.role || ''
  const backTo = role?.toLowerCase() === 'student' ? getDashboardForRole(role) : routes.studentList

  return (
    <div className="col-md-12">
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <Link
            to={backTo}
            className="btn btn-outline-secondary mb-2 d-inline-flex align-items-center"
          >
            <i className="ti ti-arrow-left me-1" />
            Back
          </Link>
          <h3 className="page-title mb-1">Student Details</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={routes.studentList}>Student</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Student Details
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center  flex-wrap">
          <Link
            to="#"
            className="btn btn-light me-2 mb-2"
            data-bs-toggle="modal"
            data-bs-target="#login_detail"
          >
            <i className="ti ti-lock me-2" />
            Login Details
          </Link>
          {studentId != null && studentId !== '' ? (
            <Link
              to={`${routes.editStudent}/${studentId}`}
              className="btn btn-primary d-flex align-items-center mb-2"
            >
              <i className="ti ti-edit-circle me-2" />
              Edit Student
            </Link>
          ) : (
            <Link
              to="#"
              className="btn btn-primary d-flex align-items-center mb-2"
              onClick={(e) => {
                e.preventDefault();
                alert('Please use the edit button from the Students List or Students Grid page to edit a specific student.');
              }}
            >
              <i className="ti ti-edit-circle me-2" />
              Edit Student
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentBreadcrumb