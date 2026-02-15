// index.tsx
import  { useEffect, useState } from "react";
import { Table } from "antd";
import type { DatatableProps } from "../../data/interface"; // Ensure correct path
 // Ensure correct path


const Datatable: React.FC<DatatableProps> = ({ columns, dataSource , Selection }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [Selections, setSelections] = useState<any>(true);
  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);

  const onSelectChange = (newSelectedRowKeys: any[], _selectedRows: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = dataSource.filter((record) =>
      Object.values(record).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredDataSource(filteredData);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (_record: any) => ({
      // Add any custom checkbox props here if needed
    }),
  };
  useEffect(() => {
    return setSelections(Selection);
  }, [Selection])
  
  
  return (
    <>
     <div className="table-top-data d-flex px-3 justify-content-between">
      <div className="page-range">
      </div>
      <div className="serch-global text-right">
        <input type="search" className="form-control form-control-sm mb-3 w-auto float-end" value={searchText} placeholder="Search" onChange={(e) => handleSearch(e.target.value)} aria-controls="DataTables_Table_0"></input>
      </div>
     </div>
     {!Selections ?
      <Table
      className="table datanew dataTable no-footer"
      rowKey={(record) => record.key || record.id || Math.random().toString()}
      columns={columns}
      rowHoverable={false}
      dataSource={filteredDataSource}
      pagination={{
        locale: { items_per_page: "" },
        nextIcon: <span>Next</span>,
        prevIcon: <span>Prev</span>,
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30"],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
    /> : 
    <Table
        className="table datanew dataTable no-footer"
        rowKey={(record) => record.key || record.id || Math.random().toString()}
        rowSelection={rowSelection}
        columns={columns}
        rowHoverable={false}
        dataSource={filteredDataSource}
        pagination={{
          locale: { items_per_page: "" },
          nextIcon: <span>Next</span>,
          prevIcon: <span>Prev</span>,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30"],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
      />}
      
    </>
  );
};

export default Datatable;
