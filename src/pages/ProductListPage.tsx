import { useState } from "react";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useCart, type Product } from "../cart/cartContext";
import { formatPrice } from "../utils/formatPrice";

const PAGE_SIZES = [100, 200, 500, 1000, 5000, 10000, 50000, 100000];

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
});

const helper = createColumnHelper<typeof features, Product>();

const columns = helper.columns([
  helper.accessor("productId", { header: "ProductId" }),
  helper.accessor("productName", { header: "Product Name" }),
  helper.accessor("price", {
    header: "Price",
    cell: (info) => formatPrice(info.getValue()),
  }),
  helper.display({
    id: "cart",
    header: "Cart",
    cell: ({ row }) => <CartToggle productId={row.original.productId} />,
  }),
]);

function CartToggle({ productId }: { productId: number }) {
  const { state, addProduct, removeProduct } = useCart();
  const inCart = state.selectedProducts.includes(productId);

  return (
    <button
      type="button"
      className={inCart ? "toggle in-cart" : "toggle"}
      onClick={() =>
        inCart ? removeProduct(productId) : addProduct(productId)
      }
      aria-pressed={inCart}
      aria-label={inCart ? "Remove from cart" : "Add to cart"}
      title={inCart ? "Remove from cart" : "Add to cart"}
    >
      {inCart ? "−" : "+"}
    </button>
  );
}

function ProductListPage() {
  const { state } = useCart();
  const [search, setSearch] = useState("");

  const table = useTable({
    features,
    columns,
    data: state.listOfProducts,
    state: { globalFilter: search },
    onGlobalFilterChange: (updater) =>
      setSearch((prev) =>
        String(typeof updater === "function" ? updater(prev) : updater),
      ),
    globalFilterFn: "includesString",
    getColumnCanGlobalFilter: (column) => column.id !== "cart",
    initialState: { pagination: { pageIndex: 0, pageSize: PAGE_SIZES[0] } },
  });

  const { pageIndex, pageSize } = table.state.pagination;
  const rows = table.getRowModel().rows;

  return (
    <section className="page">
      <h1>Products</h1>
      <input
        type="search"
        className="search"
        placeholder="Search ..."
        aria-label="Search products"
        value={search}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
      />
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className={`col-${header.column.id}`}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className={`col-${cell.column.id}`}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="empty">
                No products match “{search}”
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          type="button"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="First page"
        >
          «
        </button>
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          ‹
        </button>
        <span>
          Page {table.getPageCount() === 0 ? 0 : pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          type="button"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Last page"
        >
          »
        </button>
        <label>
          Show{" "}
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export default ProductListPage;
