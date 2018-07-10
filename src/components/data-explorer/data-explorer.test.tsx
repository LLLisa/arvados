// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from "react";
import { configure, mount } from "enzyme";
import * as Adapter from 'enzyme-adapter-react-16';

import DataExplorer from "./data-explorer";
import ContextMenu from "../context-menu/context-menu";
import ColumnSelector from "../column-selector/column-selector";
import DataTable from "../data-table/data-table";
import SearchInput from "../search-input/search-input";
import { TablePagination } from "@material-ui/core";
import { MockItem } from "../data-table/data-table.test";

configure({ adapter: new Adapter() });

describe("<DataExplorer />", () => {

    it("communicates with <SearchInput/>", () => {
        const onSearch = jest.fn();
        const dataExplorer = mount(<DataExplorer
            {...mockDataExplorerProps()}
            items={[{ key: "1", name: "item 1" }] as MockItem[]}
            searchValue="search value"
            onSearch={onSearch} />);
        expect(dataExplorer.find(SearchInput).prop("value")).toEqual("search value");
        dataExplorer.find(SearchInput).prop("onSearch")("new value");
        expect(onSearch).toHaveBeenCalledWith("new value");
    });

    it("communicates with <ColumnSelector/>", () => {
        const onColumnToggle = jest.fn();
        const columns = [{ name: "Column 1", render: jest.fn(), selected: true }];
        const dataExplorer = mount(<DataExplorer
            {...mockDataExplorerProps()}
            columns={columns}
            onColumnToggle={onColumnToggle}
            items={[{ key: "1", name: "item 1" }] as MockItem[]} />);
        expect(dataExplorer.find(ColumnSelector).prop("columns")).toBe(columns);
        dataExplorer.find(ColumnSelector).prop("onColumnToggle")("columns");
        expect(onColumnToggle).toHaveBeenCalledWith("columns");
    });

    it("communicates with <DataTable/>", () => {
        const onFiltersChange = jest.fn();
        const onSortToggle = jest.fn();
        const onRowClick = jest.fn();
        const columns = [{ name: "Column 1", render: jest.fn(), selected: true }];
        const items = [{ key: "1", name: "item 1" }] as MockItem[];
        const dataExplorer = mount(<DataExplorer
            {...mockDataExplorerProps()}
            columns={columns}
            items={items}
            onFiltersChange={onFiltersChange}
            onSortToggle={onSortToggle}
            onRowClick={onRowClick} />);
        expect(dataExplorer.find(DataTable).prop("columns").slice(0, -1)).toEqual(columns);
        expect(dataExplorer.find(DataTable).prop("items")).toBe(items);
        dataExplorer.find(DataTable).prop("onRowClick")("event", "rowClick");
        dataExplorer.find(DataTable).prop("onFiltersChange")("filtersChange");
        dataExplorer.find(DataTable).prop("onSortToggle")("sortToggle");
        expect(onFiltersChange).toHaveBeenCalledWith("filtersChange");
        expect(onSortToggle).toHaveBeenCalledWith("sortToggle");
        expect(onRowClick).toHaveBeenCalledWith("rowClick");
    });

    it("does not render <TablePagination/> if there is no items", () => {
        const dataExplorer = mount(<DataExplorer
            {...mockDataExplorerProps()}
            items={[]}
        />);
        expect(dataExplorer.find(TablePagination)).toHaveLength(0);
    });

    it("communicates with <TablePagination/>", () => {
        const onChangePage = jest.fn();
        const onChangeRowsPerPage = jest.fn();
        const dataExplorer = mount(<DataExplorer
            {...mockDataExplorerProps()}
            items={[{ key: "1", name: "item 1" }] as MockItem[]}
            page={10}
            rowsPerPage={50}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
        />);
        expect(dataExplorer.find(TablePagination).prop("page")).toEqual(10);
        expect(dataExplorer.find(TablePagination).prop("rowsPerPage")).toEqual(50);
        dataExplorer.find(TablePagination).prop("onChangePage")(undefined, 6);
        dataExplorer.find(TablePagination).prop("onChangeRowsPerPage")({ target: { value: 10 } });
        expect(onChangePage).toHaveBeenCalledWith(6);
        expect(onChangeRowsPerPage).toHaveBeenCalledWith(10);
    });
});

const mockDataExplorerProps = () => ({
    columns: [],
    items: [],
    itemsAvailable: 0,
    contextActions: [],
    searchValue: "",
    page: 0,
    rowsPerPage: 0,
    onSearch: jest.fn(),
    onFiltersChange: jest.fn(),
    onSortToggle: jest.fn(),
    onRowClick: jest.fn(),
    onColumnToggle: jest.fn(),
    onChangePage: jest.fn(),
    onChangeRowsPerPage: jest.fn(),
    onContextMenu: jest.fn()
});