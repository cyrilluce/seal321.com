/**
 * Created by cyrilluce on 2016/8/14.
 */
import * as React from "react";
import { Component, PropTypes, ComponentClass } from "react";
import { observer, inject } from "mobx-react";
import { GatewayProvider, GatewayDest } from "react-gateway";
import SearchBar from "../components/SearchBar";
import SearchList from "../components/SearchList";
import ItemDetail from "../components/ItemDetail";
import GSimulate from "../components/GSimulate";
import Version from "../components/Version";
import * as ReactPaginate from "react-paginate";
import { ItemDbStore } from "../../stores";
import { sendEvent } from "../../util";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { StickyContainer, Sticky } from "react-sticky";

// import {ReactPaginateProps} from 'react-paginate';

interface Props {
  store?: ItemDbStore;
}

// paginate组件的types定义未更新
interface PaginateProps {
  /**
     * The total number of pages.
     */
  pageCount: number;

  /**
     * The range of pages displayed.
     */
  pageRangeDisplayed: number;

  /**
     * The number of pages to display for margins.
     */
  marginPagesDisplayed: number;

  /**
     * Label for the `previous` button.
     */
  previousLabel?: string | JSX.Element;

  /**
     * Label for the `next` button.
     */
  nextLabel?: string | JSX.Element;

  /**
     * Label for ellipsis.
     */
  breakLabel?: string | JSX.Element;

  /**
     * The classname on tag `li` of the ellipsis element.
     */
  breakClassName?: string | JSX.Element;

  /**
     * The method to call when a page is clicked.
     */
  clickCallback?: Function;

  /**
     * The initial page selected.
     */
  initialSelected?: number;

  /**
     * To override selected page with parent prop.
     */
  forceSelected?: number;

  /**
     * The classname of the pagination container.
     */
  containerClassName?: string;

  /**
     * The classname on tag `li` of each page element.
     */
  pageClassName?: string;

  /**
     * The classname on tag `a` of each page element.
     */
  pageLinkClassName?: string;

  /**
     * The classname for the active page.
     */
  activeClassName?: string;

  /**
     * The classname on tag `li` of the `previous` button.
     */
  previousClassName?: string;

  /**
     * The classname on tag `li` of the `next` button.
     */
  nextClassName?: string;

  /**
     * The classname on tag `a` of the `previous` button.
     */
  previousLinkClassName?: string;

  /**
     * The classname on tag `a` of the `next` button.
     */
  nextLinkClassName?: string;

  /**
     * The classname for disabled `previous` and `next` buttons.
     */
  disabledClassName?: string;
  forcePage?: number;
  onPageChange: (...any) => void;
}

interface State {
  paginationExpanded?: boolean;
}

let ReactPaginateFix: React.ComponentClass<
  PaginateProps
> = ReactPaginate as any;

const loadingSvg = `<?xml version="1.0" encoding="utf-8"?><svg width='34px' height='34px' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-spin"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><g transform="translate(50 50)"><g transform="rotate(0) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#cec9c9"><animate attributeName="opacity" from="1" to="0.1" begin="0s" dur="1s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0s" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(45) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#cec9c9"><animate attributeName="opacity" from="1" to="0.1" begin="0.12s" dur="1s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.12s" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(90) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#cec9c9"><animate attributeName="opacity" from="1" to="0.1" begin="0.25s" dur="1s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.25s" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(135) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#cec9c9"><animate attributeName="opacity" from="1" to="0.1" begin="0.37s" dur="1s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.37s" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(180) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#cec9c9"><animate attributeName="opacity" from="1" to="0.1" begin="0.5s" dur="1s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.5s" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(225) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#cec9c9"><animate attributeName="opacity" from="1" to="0.1" begin="0.62s" dur="1s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.62s" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(270) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#cec9c9"><animate attributeName="opacity" from="1" to="0.1" begin="0.75s" dur="1s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.75s" dur="1s" repeatCount="indefinite"></animateTransform></circle></g><g transform="rotate(315) translate(34 0)"><circle cx="0" cy="0" r="8" fill="#cec9c9"><animate attributeName="opacity" from="1" to="0.1" begin="0.87s" dur="1s" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="scale" from="1.5" to="1" begin="0.87s" dur="1s" repeatCount="indefinite"></animateTransform></circle></g></g></svg>`;

@DragDropContext(HTML5Backend)
@inject("store")
@observer
export default class ItemDb extends Component<Props, State> {
  render() {
    // Injected by connect() call:
    const { store } = this.props;
    const state = this.state || {};
    const { paginationExpanded } = state;
    const {
      keyword,
      page,
      pageSize,
      pageCount,
      dataLoading: searching,
      data
    } = store;

    const handlePageClick = page => {
      // 翻页后，重置展开的状态
      this.setState({ paginationExpanded: false });
      sendEvent("click", "page");
      // react-paginate的page对象selected属性是0-base
      this.props.store.paginate(page.selected + 1);
    };

    return (
      <GatewayProvider>
        <StickyContainer className="container-fluid">
          <h1>物品数据库 v2.0 Beta <Version version={store.version} /></h1>
          <Sticky className="fixed-toolbar">
            <SearchBar />
            <GSimulate />
            <ReactPaginateFix
              previousLabel={"«"}
              nextLabel={"»"}
              breakLabel={
                <a
                  href="#"
                  onClick={() => {
                    this.setState({ paginationExpanded: true }), sendEvent(
                      "click",
                      "page.more"
                    );
                  }}
                >
                  ...
                </a>
              }
              // breakLabel="..."
              breakClassName={"break"}
              forcePage={page - 1}
              pageCount={pageCount}
              marginPagesDisplayed={paginationExpanded ? 999 : 1}
              pageRangeDisplayed={paginationExpanded ? 999 : 3}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
            {data &&
              data.count > 0 &&
              <span className="db-count badge">{data.count}</span>}
            {searching &&
              <span
                className="db-loading"
                dangerouslySetInnerHTML={{ __html: loadingSvg }}
              />}
          </Sticky>
          <SearchList
            onItemClick={item => {
              store.viewItem(item);
            }}
          />
          <ItemDetail />
          <div className="well well-sm contact-me">
            通过
            {" "}
            <a href="https://groups.google.com/d/forum/seal321" target="_blank">
              Google Group
            </a>
            {" "}或 <a href="mailto:cyrilluce@gmail.com">发送邮件</a> 交流与反馈问题
          </div>
          <GatewayDest name="global" />
        </StickyContainer>
      </GatewayProvider>
    );
  }
}
