import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vite-plus/test";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "./Table.tsx";

function renderTable() {
  return render(
    <Table caption="Users">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell align="end">Age</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell align="end">32</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell align="end">28</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
}

test("renders a table with rows", () => {
  renderTable();
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getAllByRole("row")).toHaveLength(3);
});

test("renders caption (visually hidden by default)", () => {
  renderTable();
  expect(screen.getByText("Users")).toBeInTheDocument();
  expect(screen.getByText("Users")).toHaveClass("ds-table-caption--hidden");
});

test("renders visible caption", () => {
  render(
    <Table caption="Visible caption" captionVisible>
      <TableBody>
        <TableRow>
          <TableCell>Data</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(screen.getByText("Visible caption")).not.toHaveClass("ds-table-caption--hidden");
});

test("renders header cells with scope=col", () => {
  renderTable();
  const headers = screen.getAllByRole("columnheader");
  expect(headers).toHaveLength(2);
  expect(headers[0]).toHaveAttribute("scope", "col");
});

test("supports align on cells", () => {
  renderTable();
  const ageCells = screen.getAllByText(/32|28/);
  for (const cell of ageCells) {
    expect(cell).toHaveAttribute("data-align", "end");
  }
});

test("supports striped prop", () => {
  render(
    <Table striped>
      <TableBody>
        <TableRow>
          <TableCell>A</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(screen.getByRole("table")).toHaveClass("ds-table--striped");
});

test("supports compact density", () => {
  render(
    <Table density="compact">
      <TableBody>
        <TableRow>
          <TableCell>A</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(screen.getByRole("table")).toHaveClass("ds-table--compact");
});

test("supports selected row", () => {
  render(
    <Table>
      <TableBody>
        <TableRow selected>
          <TableCell>Selected</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  const row = screen.getByRole("row");
  expect(row).toHaveAttribute("data-selected", "true");
});

test("renders table footer", () => {
  const { container } = render(
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Data</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
        </TableRow>
      </TableFooter>
    </Table>,
  );
  expect(container.querySelector("tfoot")).toBeInTheDocument();
});

test("Table forwards ref", () => {
  const ref = createRef<HTMLTableElement>();
  render(
    <Table ref={ref}>
      <TableBody>
        <TableRow>
          <TableCell>Data</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(ref.current?.tagName).toBe("TABLE");
});

test("TableRow forwards ref", () => {
  const ref = createRef<HTMLTableRowElement>();
  render(
    <Table>
      <TableBody>
        <TableRow ref={ref}>
          <TableCell>Data</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(ref.current?.tagName).toBe("TR");
});

test("TableCell forwards ref", () => {
  const ref = createRef<HTMLTableCellElement>();
  render(
    <Table>
      <TableBody>
        <TableRow>
          <TableCell ref={ref}>Data</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(ref.current?.tagName).toBe("TD");
});

test("TableHeaderCell forwards ref", () => {
  const ref = createRef<HTMLTableCellElement>();
  render(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell ref={ref}>Header</TableHeaderCell>
        </TableRow>
      </TableHeader>
    </Table>,
  );
  expect(ref.current?.tagName).toBe("TH");
});

test("wraps in scrollable container", () => {
  const { container } = render(
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Data</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(container.querySelector(".ds-table-container")).toBeInTheDocument();
});

test("passes through className", () => {
  render(
    <Table className="custom">
      <TableBody>
        <TableRow>
          <TableCell>Data</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(screen.getByRole("table")).toHaveClass("custom");
  expect(screen.getByRole("table")).toHaveClass("ds-table");
});
