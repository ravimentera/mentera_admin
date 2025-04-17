'use client';

import { useState, useEffect, useMemo } from 'react';

export default function DataTable({ data, columns }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Apply filtering, sorting and pagination
  const filteredAndSortedData = useMemo(() => {
    // Filter data based on search term
    let filteredData = [...data];
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        return Object.values(item).some(
          value => value.toString().toLowerCase().includes(lowerCaseSearch)
        );
      });
    }
    
    // Sort data
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const valueA = a[sortConfig.key] || '';
        const valueB = b[sortConfig.key] || '';
        
        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredData;
  }, [data, searchTerm, sortConfig]);
  
  // Get current page items
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredAndSortedData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);
  
  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.ceil(filteredAndSortedData.length / itemsPerPage),
    [filteredAndSortedData, itemsPerPage]
  );
  
  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Reset to first page when filtered data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  return (
    <div className="data-table-container">
      {/* Search box */}
      <div className="table-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="items-per-page">
          <label>Items per page: </label>
          <select 
            value={itemsPerPage} 
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      
      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  onClick={() => requestSort(column.key)}
                  className={sortConfig.key === column.key ? `sorted-${sortConfig.direction}` : ''}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span className="sort-indicator">
                      {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {(column.key === 'website' || column.key === 'googleMaps') && item[column.key] !== 'N/A' ? (
                        <a href={item[column.key]} target="_blank" rel="noopener noreferrer">
                          {column.key === 'website' ? 'Visit Website' : 'View on Google Maps'}
                        </a>
                      ) : column.key === 'phone' && item[column.key] !== 'N/A' ? (
                        <a href={`tel:${item[column.key].replace(/\D/g, '')}`}>
                          {item[column.key]}
                        </a>
                      ) : column.key === 'hours' ? (
                        <div className="hours-container">
                          {item[column.key] === 'N/A' ? 'N/A' : 
                            item[column.key].split(' | ').map((day, idx) => (
                              <div key={idx} className="hours-row">{day}</div>
                            ))
                          }
                        </div>
                      ) : (
                        item[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  {searchTerm ? 'No matching results' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(1)} 
            disabled={currentPage === 1}
            className="page-btn"
          >
            &laquo;
          </button>
          
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="page-btn"
          >
            &lsaquo;
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            &rsaquo;
          </button>
          
          <button 
            onClick={() => handlePageChange(totalPages)} 
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            &raquo;
          </button>
        </div>
      )}
      
      {/* Result count */}
      <div className="result-count">
        Showing {currentItems.length} of {filteredAndSortedData.length} results
      </div>
    </div>
  );
}