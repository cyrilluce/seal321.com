/**
 * Created by cyrilluce on 2016/8/14.
 */
import * as React from 'react';
import { Component, PropTypes, ComponentClass } from 'react'
import { observer, inject } from 'mobx-react';
import SearchBar from '../components/SearchBar';
import SearchList from '../components/SearchList';
import * as ReactPaginate from 'react-paginate';
import ItemDbStore from '../../stores/db';
// import {ReactPaginateProps} from 'react-paginate';

interface Props{
    store?: ItemDbStore;
}

// paginate组件的types定义未更新
interface PaginateProps{
    /**
     * The total number of pages.
     */
    pageNum: number;

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
    pageCount?: number;
    onPageChange: (...any)=>void
}

let ReactPaginateFix: React.ComponentClass<PaginateProps> = ReactPaginate as any;

@inject('store')
@observer
export default class ItemDb extends Component<Props, {}> {
    handlePageClick(){
        
    }
    render() {
        // Injected by connect() call:
        const { store } = this.props;
        const { keyword, page, pageSize, list, totalCount, pageCount, searching} = store;
        return <div>
            <SearchBar keyword={keyword} onSearch={keyword=>store.search(keyword)} />
            <SearchList searching={searching} list={list} />
            <ReactPaginateFix previousLabel={"«"}
                    nextLabel={"»"}
                    breakLabel={<a href="">...</a>}
                    breakClassName={"break-me"}
                    pageNum={page}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pages pagination"}
                    activeClassName={"active"} />
        </div>
    }
}