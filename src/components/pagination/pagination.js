import React, { PureComponent } from "react";

const defaultProps = {
  initialPage: 1,
  pageSize: 3,
};

class Pagination extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pages: {},
    };
  }

  UNSAFE_componentWillMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
  }

  setPage(page) {
    var { items, pageSize } = this.props;
    var pages = this.state.pages;

    if (page < 1 || page > pages.totalPages) {
      return;
    }

    // get new pages object for specified page
    pages = this.getpages(items.length, page, pageSize);

    // get new page of items from items array
    var pageOfItems = items.slice(pages.startIndex, pages.endIndex + 1);

    // update state
    this.setState({ pages: pages });

    // call change page function in parent component
    this.props.onChangePage(pageOfItems);
  }

  getpages(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 3
    pageSize = pageSize || 3;

    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);

    var startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pages control
    var pages = [...Array(endPage + 1 - startPage).keys()].map(
      (i) => startPage + i
    );

    // return object with all pages properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }
  render() {
    var pages = this.state.pages;

    if (!pages.pages || pages.pages.length <= 1) {
      // don't display pages if there is only 1 page
      return null;
    }
    return (
      <div className="pagination">
        <ul className="pagination">
          <li className={pages.currentPage === 1 ? "disabled" : ""}>
            <a onClick={() => this.setPage(1)}>First</a>
          </li>
          <li className={pages.currentPage === 1 ? "disabled" : ""}>
            <a onClick={() => this.setPage(pages.currentPage - 1)}>Previous</a>
          </li>
          {pages.pages.map((page, index) => (
            <li
              key={index}
              className={pages.currentPage === page ? "active" : ""}
            >
              <a onClick={() => this.setPage(page)}>{page}</a>
            </li>
          ))}
          <li
            className={pages.currentPage === pages.totalPages ? "disabled" : ""}
          >
            <a onClick={() => this.setPage(pages.currentPage + 1)}>Next</a>
          </li>
          <li
            className={pages.currentPage === pages.totalPages ? "disabled" : ""}
          >
            <a onClick={() => this.setPage(pages.totalPages)}>Last</a>
          </li>
        </ul>
      </div>
    );
  }
}

Pagination.defaultProps = defaultProps;
export default Pagination;
