import  { useRef, useState } from "react";
import Table from "../../../core/common/dataTable/index";
import { classSyllabus } from "../../../core/data/json/class-syllabus";
import {
  activeList,
  classSection,
  classSylabus,
} from "../../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import type { TableData } from "../../../core/data/interface";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../../core/common/tooltipOption";

const ClassSyllabus = () => {
  const routes = all_routes;
  const [selectedSyllabus, setSelectedSyllabus] = useState<any>(null);

  const data = classSyllabus;
  const columns = [
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },

    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: TableData, b: TableData) => a.section.length - b.section.length,
    },
    {
      title: "Subject Group",
      dataIndex: "subjectGroup",
      sorter: (a: TableData, b: TableData) => a.subjectGroup.length - b.subjectGroup.length,
    },
    {
      title: "CreatedDate",
      dataIndex: "createdDate",
      sorter: (a: TableData, b: TableData) => a.createdDate.length - b.createdDate.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: () => (
        <>
         <span className="badge badge-soft-success d-inline-flex align-items-center"><i
					className="ti ti-circle-filled fs-5 me-1"></i>Active</span>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <>
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <Link
                to="#"
                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="ti ti-dots-vertical fs-14" />
              </Link>
              <ul className="dropdown-menu dropdown-menu-right p-3">
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSyllabus(record);
                      setTimeout(() => {
                        const modalElement = document.getElementById('edit_syllabus');
                        if (modalElement) {
                          const bootstrap = (window as any).bootstrap;
                          if (bootstrap && bootstrap.Modal) {
                            const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                            modal.show();
                          }
                        }
                      }, 100);
                    }}
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-modal"
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
  ];
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Books</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Syllabus </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Subject Group
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_syllabus"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Subject Group
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Guardians List */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Class Syllabus</h4>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start mb-3 me-2 position-relative">
                  <PredefinedDateRanges />
                  </div>
                  <div className="dropdown mb-3 me-2">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-filter me-2" />
                      Filter
                    </Link>
                    <div className="dropdown-menu drop-width"  ref={dropdownMenuRef}>
                      <form >
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom pb-0">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={classSylabus}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Section</label>
                                <CommonSelect
                                  className="select"
                                  options={classSection}
                                  defaultValue={classSylabus[0]}
                                  
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Status</label>
                                <CommonSelect
                                  className="select"
                                  options={activeList}
                                  defaultValue={activeList[0]}
                                   
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                          <Link to="#" className="btn btn-light me-3">
                            Reset
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-primary"
                            onClick={handleApplyClick}
                          >
                            Apply
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort by A-Z
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1 active"
                        >
                          Ascending
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Descending
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Recently Viewed
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-item rounded-1"
                        >
                          Recently Added
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 py-3">
                {/* Guardians List */}
                <Table columns={columns} dataSource={data} Selection={true} />
              
                {/* /Guardians List */}
              </div>
            </div>
            {/* /Guardians List */}
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
      <div>
        {/* Add Syllabus */}
        <div className="modal fade" id="add_syllabus">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Subject Group</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                                  className="select"
                                  options={classSylabus}
                                  defaultValue={classSylabus[0]}
                                   
                                />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                                  className="select"
                                  options={classSection}
                                  defaultValue={classSection[0]}
                                   
                                />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Subject Group</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-primary" data-bs-dismiss="modal">
                    Add Subject Group
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Syllabus */}
        {/* Edit Syllabus */}
        <div className="modal fade" id="edit_syllabus">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Subject Group</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        <CommonSelect
                                  className="select"
                                  options={classSylabus}
                                  defaultValue={selectedSyllabus?.class ? (classSylabus.find((c: any) => c.label === selectedSyllabus.class || c.value === selectedSyllabus.class) || classSylabus[0]) : classSylabus[0]}
                                  key={`edit-syllabus-class-${selectedSyllabus?.class ?? 'new'}`}
                                />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Section</label>
                        <CommonSelect
                                  className="select"
                                  options={classSection}
                                  defaultValue={selectedSyllabus?.section ? (classSection.find((s: any) => s.label === selectedSyllabus.section || s.value === selectedSyllabus.section) || classSection[0]) : classSection[0]}
                                  key={`edit-syllabus-section-${selectedSyllabus?.section ?? 'new'}`}
                                />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Subject Group</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Subject Group"
                          defaultValue={selectedSyllabus?.subjectGroup ?? ''}
                          key={`edit-syllabus-subject-${selectedSyllabus?.subjectGroup ?? 'new'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-primary" data-bs-dismiss="modal">
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Syllabus	*/}
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form >
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete all the marked items, this cant be undone
                    once you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <Link
                      to="#"
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link to="#" className="btn btn-danger" data-bs-dismiss="modal">
                      Yes, Delete
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </div>
    </div>
  );
};

export default ClassSyllabus;
